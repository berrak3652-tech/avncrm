import pandas as pd
import json

pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', 50)

xl = pd.ExcelFile(r'd:\acursor\avncrm\ÜRÜNLER MALİYET FİYAT.xlsx')

all_data = {}

for sheet_name in xl.sheet_names:
    print(f'\n{"="*60}')
    print(f'SHEET: {sheet_name}')
    print(f'{"="*60}')
    
    df = pd.read_excel(xl, sheet_name=sheet_name)
    print(f'Columns: {list(df.columns)}')
    print(f'Rows: {len(df)}')
    print()
    
    # Clean the dataframe - drop rows/cols that are all NaN
    df_clean = df.dropna(how='all').dropna(axis=1, how='all')
    
    # Print first 30 rows as dict
    for i, row in df_clean.head(30).iterrows():
        row_dict = {k: v for k, v in row.items() if pd.notna(v)}
        print(f'Row {i}: {row_dict}')
    
    # Save to JSON
    all_data[sheet_name] = df_clean.to_dict(orient='records')

# Save to JSON file
with open('excel_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2, default=str)

print('\n\nVeriler başarıyla excel_data.json dosyasına kaydedildi.')
