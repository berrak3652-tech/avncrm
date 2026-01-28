import pandas as pd
import json
import os

# Excel file path
excel_path = r'd:\acursor\avncrm\ÜRÜNLER MALİYET FİYAT.xlsx'
output_path = r'd:\acursor\avncrm\crm-app\src\data\excelData.ts'

def clean_val(p):
    if pd.isna(p):
        return None
    if isinstance(p, str):
        # Remove multiple spaces and newlines
        return " ".join(p.split()).strip()
    return p

def run_sync():
    print(f"Reading Excel: {excel_path}")
    xl = pd.ExcelFile(excel_path)
    
    # Static Data
    sales_channels = [
        { "id": 'trendyol', "name": 'Trendyol', "commission": 18, "color": '#F27A1A' },
        { "id": 'hepsiburada', "name": 'Hepsiburada', "commission": 18, "color": '#FF6000' },
        { "id": 'n11', "name": 'N11', "commission": 18, "color": '#7B68EE' },
        { "id": 'ciceksepeti', "name": 'Çiçeksepeti', "commission": 18, "color": '#FF69B4' },
        { "id": 'vivense', "name": 'Vivense', "commission": 10, "color": '#2D5A27' },
        { "id": 'bertaconcept', "name": 'AvynaConcept', "commission": 7, "color": '#1E3A5F' },
        { "id": 'koctas', "name": 'Koçtaş', "commission": 7, "color": '#E31E24' },
        { "id": 'website', "name": 'Web Sitesi', "commission": 0, "color": '#4A90D9' },
        { "id": 'direct', "name": 'Direkt Satış', "commission": 0, "color": '#27AE60' },
    ]

    # 1. Product BOM (ürün ağaçları) - We read this first to discover all materials
    df_bom = pd.read_excel(xl, 'ürün ağaçları')
    product_bom = {}
    bom_materials = {} # To track materials discovered in BOM
    
    for _, row in df_bom.iterrows():
        product_name = clean_val(row.get('urun adı'))
        if not product_name: continue
        
        if product_name not in product_bom:
            product_bom[product_name] = []
            
        mat_name = clean_val(row.get('malzeme'))
        if mat_name:
            # Discover and store material details from BOM rows
            if mat_name not in bom_materials:
                bom_materials[mat_name] = {
                    "name": mat_name,
                    "usedIn": clean_val(row.get('urun modul adı')), # Guestimate usedIn from first encounter
                    "unit": clean_val(row.get('satın alma birimi')),
                    "unitPrice": float(row.get('birim fiyat', 0) or 0)
                }

            product_bom[product_name].append({
                "category": clean_val(row.get('urun modul adı')),
                "material": mat_name,
                "quantity": float(row.get('miktar', 0) or 0),
                "unit": clean_val(row.get('satın alma birimi')),
                "price": float(row.get('toplam fiyat', 0) or 0)
            })

    # 2. Materials Data (birim fiyatlar)
    df_materials = pd.read_excel(xl, 'birim fiyatlar')
    materials_dict = {} # Use dict for deduplication and prioritized merging
    
    # First: Add materials from 'birim fiyatlar' (this sheet has priority for prices)
    for _, row in df_materials.iterrows():
        name = clean_val(row.get('malzeme adı'))
        if not name: continue
        materials_dict[name] = {
            "name": name,
            "usedIn": clean_val(row.get('kullanıldığı birim')),
            "unit": clean_val(row.get('birim', '')),
            "unitPrice": float(row.get('birim fiyatı KDVSİZ', 0) or 0)
        }
    
    # Second: Add materials from BOM that were MISSING in 'birim fiyatlar'
    for mat_name, mat_info in bom_materials.items():
        if mat_name not in materials_dict:
            materials_dict[mat_name] = mat_info
            
    materials_data = list(materials_dict.values())

    # 3. Cargo Prices (ARAS KARGO)
    df_cargo = pd.read_excel(xl, 'ARAS KARGO')
    cargo_data = []
    # Skip rows where DESİ is NaN
    df_cargo = df_cargo.dropna(subset=['DESİ'])
    for _, row in df_cargo.iterrows():
        cargo_data.append({
            "company": "Horoz Lojistik",
            "desi": int(row.get('DESİ', 0)),
            "price": float(row.get('HOROZ', 0) or 0)
        })

    # 4. Labor Data (İşçilik)
    df_labor = pd.read_excel(xl, 'İşçilik')
    labor_data = []
    for _, row in df_labor.iterrows():
        pname = clean_val(row.get('ürün adı'))
        if not pname: continue
        labor_data.append({
            "productName": pname,
            "moduleName": clean_val(row.get('modül adı')),
            "piecesPerPerson": float(row.get('Bir Kişi Kaç Adet Yapar', 0) or 0),
            "hourlyWage": float(row.get('Saat Ücreti', 0) or 0),
            "totalLabor": float(row.get('Toplam İşçilik', 0) or 0)
        })

    # 5. Sales Prices Data (TRENDYOL SATIŞ FİYATLARI)
    df_sales = pd.read_excel(xl, 'TRENDYOL SATIŞ FİYATLARI')
    sales_prices_data = []
    for _, row in df_sales.iterrows():
        name = clean_val(row.get('ürün adı'))
        if not name: continue
        
        # Mapping based on analysis
        sales_prices_data.append({
            "name": name,
            "moduleName": clean_val(row.get('modül adı')),
            "desi": int(row.get('Ürün Desi', 0) or 0),
            "materialCost": float(row.get('Malzeme', 0) or 0),
            "laborCost": float(row.get('İşçilik', 0) or 0),
            "overheadCost": float(row.get('Genel Gider', 0) or 0),
            "returnCost": float(row.get('İade', 0) or 0),
            "totalCost": float(row.get('toplam maliyet', 0) or 0),
            "cargoCost": float(row.get('HOROZ LOJİSTİK CARİ', 0) or 0),
            "commission": float(row.get('komisyon\n(%18)', 0) or 0),
            "taxDiff": float(row.get('vergi farkı', 0) or 0),
            "profitMargin": float(row.get('Kâr Yüzdesi', 0) or 0),
            "profit": float(row.get('Kâr', 0) or 0),
            "salePrice": float(row.get('satış fiyatı', 0) or 0),
            "vivense": float(row.get('VIVENSE', 0) or 0),
            "hepsiburada": float(row.get('\nHEPSİBURADA\nÇİÇEKSEPETİ\nN11', 0) or 0),
            "bertaconcept": float(row.get('BERTACONCEPT.COM', 0) or 0),
            "koctas": float(row.get('KOÇTAŞ', 0) or 0)
        })

    # 6. Supply Products Data (urunler_duzenlenmis.xlsx)
    supply_path = r'd:\acursor\avncrm\urunler_duzenlenmis.xlsx'
    supply_products_data = []
    if os.path.exists(supply_path):
        print(f"Reading Supply Products: {supply_path}")
        df_supply = pd.read_excel(supply_path)
        for _, row in df_supply.iterrows():
            # Join categories if they exist
            cat_parts = [clean_val(row.get(c)) for c in ['mainCategory', 'category', 'subCategory'] if clean_val(row.get(c))]
            full_cat = " > ".join(cat_parts) if cat_parts else "Genel"
            
            supply_products_data.append({
                "code": clean_val(row.get('Product_code')),
                "id": str(clean_val(row.get('Product_id'))),
                "name": clean_val(row.get('Name')),
                "category": full_cat,
                "brand": clean_val(row.get('Brand')) or 'Belirtilmemiş',
                "price": float(row.get('price1', 0) or 0),
                "stock": int(row.get('Stock', 0) or 0),
                "tax": 20, # Default VAT
                "currency": "TRY",
                "description": clean_val(row.get('Description')) or '',
                "cargoCost": 0,
                "returnCost": 0,
                "profitMargin": 25,
                "desi": 0,
                "cargoCompany": "Horoz Lojistik",
                "images": [img for img in [
                    clean_val(row.get('Image1')),
                    clean_val(row.get('Image2')),
                    clean_val(row.get('Image3')),
                    clean_val(row.get('Image4')),
                    clean_val(row.get('Image5'))
                ] if img]
            })
    else:
        print(f"Warning: Supply products file not found: {supply_path}")

    # Generate the TS file content
    content = f"""// Excel'den aktarılan veriler - ÜRÜNLER MALİYET FİYAT.xlsx
// Son güncelleme: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}

export const SALES_CHANNELS = {json.dumps(sales_channels, indent=4, ensure_ascii=False)};

export const PRODUCT_BOM: Record<string, any[]> = {json.dumps(product_bom, indent=4, ensure_ascii=False)};

export const MATERIALS_DATA = {json.dumps(materials_data, indent=4, ensure_ascii=False)};

export const LABOR_DATA = {json.dumps(labor_data, indent=4, ensure_ascii=False)};

export const SALES_PRICES_DATA = {json.dumps(sales_prices_data, indent=4, ensure_ascii=False)};
 
 export const CARGO_PRICES_DATA = {json.dumps(cargo_data, indent=4, ensure_ascii=False)};

export const SUPPLY_PRODUCTS_DATA = {json.dumps(supply_products_data, indent=4, ensure_ascii=False)};
 """

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Sync complete! File updated: {output_path}")

if __name__ == "__main__":
    run_sync()
