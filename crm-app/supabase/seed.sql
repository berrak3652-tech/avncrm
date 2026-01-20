-- Seed data from Excel - Run this in Supabase SQL Editor after schema.sql

-- Insert Products (from SALES_PRICES_DATA)
INSERT INTO products (name, module_name, category, desi, material_cost, labor_cost, overhead_cost, return_cost, total_cost, cargo_cost, commission, tax_difference, profit_margin, profit, sale_price, vivense_price, hepsiburada_price, bertaconcept_price, koctas_price, stock, status) VALUES
('EXİTO', 'ÇALIŞMA&LAPTOP MASASI', 'Çalışma Masası', 15, 305.89, 110, 0, 28.2, 444.09, 282, 0, -56.4, 0, -669.69, 0, 0, 0, 0, 0, 10, 'inactive'),
('PASSİON', 'ÇALIŞMA&LAPTOP MASASI RAFLI', 'Çalışma Masası', 20, 558.80, 123.75, 69.5, 28.2, 780.25, 282, 253.54, 31.89, 0.03, 42.33, 1390, 1251, 1529, 1294.79, 1483.13, 25, 'active'),
('ORDENADO', 'ÇALIŞMA&LAPTOP MASASI KİTAPLIKLI 6 RAFLI', 'Çalışma Masası', 30, 975.41, 330, 124.5, 28.2, 1458.11, 282, 454.18, 101.76, 0.08, 193.95, 2490, 2241, 2739, 2319.44, 2656.83, 18, 'active'),
('COLECTİVO', 'ÇALIŞMA&LAPTOP MASASI KİTAPLIKLI 5 RAFLI', 'Çalışma Masası', 25, 854.75, 330, 119.5, 28.2, 1332.45, 282, 435.94, 95.41, 0.10, 244.20, 2390, 2151, 2629, 2226.29, 2550.13, 22, 'active'),
('TORRE', 'ÇALIŞMA&LAPTOP MASASI KİTAPLIKLI 4 RAFLI', 'Çalışma Masası', 20, 731.13, 330, 114.5, 28.2, 1203.83, 282, 417.70, 89.06, 0.13, 297.41, 2290, 2061, 2519, 2133.14, 2443.43, 30, 'active'),
('MAGO', 'ÇALIŞMA&LAPTOP MASASI KATLANIR', 'Çalışma Masası', 40, 691.78, 330, 99.5, 32.72, 1154.00, 327.17, 362.98, 60.97, 0.04, 84.88, 1990, 1791, 2189, 1853.69, 2123.33, 15, 'active'),
('GATİTO', 'BAHÇE&BALKON MASA TAKIMI 2 KİŞİLİK', 'Bahçe Mobilyası', 15, 511.26, 198, 79.5, 28.2, 816.96, 282, 290.02, 44.60, 0.10, 156.43, 1590, 1431, 1749, 1481.09, 1696.53, 12, 'active'),
('CUBO', 'TABURE', 'Tabure', 3, 127.41, 66, 34.5, 28.2, 256.11, 282, 125.86, -12.57, 0.06, 38.61, 690, 621, 759, 642.74, 736.23, 50, 'active'),
('CUBO İKİLİ', 'TABURE', 'Tabure', 6, 166.00, 141.43, 59.5, 28.2, 395.13, 282, 217.06, 19.19, 0.23, 276.63, 1190, 1071, 1309, 1108.49, 1269.73, 35, 'active'),
('SEGURO', 'BAHÇE&BALKON MASA TAKIMI 2 KİŞİLİK', 'Bahçe Mobilyası', 20, 662.38, 198, 87, 28.2, 975.58, 282, 317.38, 54.12, 0.06, 110.92, 1740, 1566, 1914, 1620.81, 1856.58, 8, 'active'),
('BAJO', 'OTURAK', 'Oturak', 10, 217.82, 123.75, 49.5, 28.2, 419.27, 282, 180.58, 6.48, 0.10, 101.67, 990, 891, 1089, 922.19, 1056.33, 40, 'active'),
('BAJO İKİLİ', 'OTURAK', 'Oturak', 20, 274.00, 247.50, 74.5, 28.2, 624.20, 282, 271.78, 38.24, 0.18, 273.78, 1490, 1341, 1639, 1387.94, 1589.83, 28, 'active'),
('SİLLA', 'OTURAK', 'Oturak', 10, 226.77, 198, 49.5, 28.2, 502.47, 282, 180.58, 6.48, 0.02, 18.47, 990, 891, 1089, 922.19, 1056.33, 32, 'active'),
('SABİO', 'KİTAPLIK 6 RAFLI', 'Kitaplık', 25, 707.93, 247.50, 94.5, 28.2, 1078.13, 282, 344.74, 63.65, 0.06, 121.48, 1890, 1701, 2079, 1760.54, 2016.63, 14, 'active'),
('EMOCION', 'KITAPLIK 5 RAFLI', 'Kitaplık', 20, 603.11, 247.50, 89.5, 28.2, 968.31, 282, 326.50, 57.30, 0.09, 155.89, 1790, 1611, 1969, 1667.39, 1909.93, 16, 'active'),
('RAPİDO', 'KİTAPLIK 4 RAFLI', 'Kitaplık', 20, 505.86, 247.50, 84.5, 28.2, 866.06, 282, 308.26, 50.95, 0.11, 182.74, 1690, 1521, 1859, 1574.24, 1803.23, 20, 'active'),
('VİRTUAL', 'TV SEHPASI', 'TV Sehpası', 15, 325.30, 76.15, 50, 28.2, 479.66, 282, 182.40, 7.12, 0.05, 48.82, 1000, 900, 1100, 931.50, 1067, 25, 'active'),
('VİSİON', 'TV ÜNİTESİ 6 RAFLI TEK', 'TV Ünitesi', 4, 1027.30, 330, 149.5, 28.2, 1535.00, 282, 545.38, 133.52, 0.17, 494.10, 2990, 2691, 3289, 2785.19, 3190.33, 10, 'active'),
('PARİLLA', 'PİKNİK KAMP BALKON BAHÇE MASASI 60*80 CM', 'Kamp Ürünleri', 10, 183.51, 39.60, 50, 28.2, 301.31, 282, 182.40, 7.12, 0.23, 227.17, 1000, 900, 1100, 931.50, 1067, 45, 'active'),
('PRİMAVERA', 'PİKNİK KAMP BALKON BAHÇE MASASI 45*60 CM', 'Kamp Ürünleri', 5, 116.29, 39.60, 50, 28.2, 234.09, 282, 182.40, 7.12, 0.29, 294.39, 1000, 900, 1100, 931.50, 1067, 55, 'active'),
('FUERTE TEKLİ', 'Ahşap Kollu Kamp Piknik Bahçe Balkon Sandalyesi Katlanır', 'Kamp Sandalyesi', 5, 140.79, 28.29, 50, 28.2, 247.27, 282, 182.40, 7.12, 0.28, 281.21, 1000, 900, 1100, 931.50, 1067, 60, 'active'),
('FUERTE İKİLİ', '2 Adet Ahşap Kollu Kamp Piknik Sandalye', 'Kamp Sandalyesi', 10, 281.58, 56.57, 50, 28.2, 416.35, 282, 182.40, 7.12, 0.11, 112.13, 1000, 900, 1100, 931.50, 1067, 40, 'active'),
('JARDİNERO', 'Katlanır Masa + Sandalye Seti', 'Kamp Seti', 20, 465.09, 135.62, 50, 28.2, 678.90, 282, 182.40, 7.12, -0.15, -150.42, 1000, 900, 1100, 931.50, 1067, 8, 'inactive'),
('İMPONENTE', 'TV ÜNİTESİ 6 RAFLI ÇİFT', 'TV Ünitesi', 40, 1691.91, 495, 199.5, 32.72, 2419.13, 327.17, 727.78, 188.01, 0.08, 327.91, 3990, 3591, 4389, 3716.69, 4257.33, 6, 'active');

-- Insert Materials (from MATERIALS_DATA)
INSERT INTO materials (name, used_in, unit, unit_price, stock, min_stock) VALUES
('AHSAP AİLA', 'MONTAJ', 'TK', 220.0, 150, 50),
('AHSAP CILALI FUERTE KOL ISKELETI', 'MONTAJ', 'AD', 10.0, 500, 100),
('AHSAP CILALI ISKELET GLUM', 'MONTAJ', 'TK', 75.0, 200, 50),
('AHSAP CILALI ISKELET BAHÇE 6*55*2 CM', 'MONTAJ', 'AD', 30.0, 300, 80),
('AHSAP CILALI ISKELET POPPY', 'MONTAJ', 'AD', 50.0, 180, 50),
('AHSAP CILALI ISKELET STARK', 'MONTAJ', 'TK', 300.0, 80, 20),
('AMBALAJ NAYLON 10 MM PAT PAT 2. KALITE 140 CM', 'AMBALAJ', 'KG', 35.0, 500, 100),
('BALY 15 KG', 'BEYAZLAMA', 'KG', 55.0, 200, 50),
('BOYA PARLAK SIYAH', 'METALHANE', 'KG', 60.0, 150, 40),
('BOYA TEKSTURE SIYAH 9005 (MK) PE-MAT', 'METALHANE', 'KG', 40.0, 180, 50),
('CIRT 20 MM (DİŞİ VE ERKEK)', 'TERZİHANE', 'M', 5.0, 1000, 200),
('CIVATA M6*15 MM YSB', 'MONTAJ', 'AD', 1.0, 5000, 1000),
('CIVATA M6*20 MM YSB', 'MONTAJ', 'AD', 1.0, 5000, 1000),
('CIVATA M6*30 MM YSB', 'MONTAJ', 'AD', 1.0, 4000, 800),
('CIVATA M6*35 MM YSB', 'MONTAJ', 'AD', 1.0, 3500, 700),
('CIVATA M6*40 MM YSB', 'MONTAJ', 'AD', 1.0, 3000, 600),
('CIVATA M6*50 MM YSB', 'MONTAJ', 'AD', 1.0, 2500, 500),
('CIVATA M6*60 MM YSB', 'MONTAJ', 'AD', 1.0, 2000, 400),
('CIVATA M8*20 MM AKB', 'MONTAJ', 'AD', 1.5, 3000, 600),
('CIVATA M8*30 MM AKB', 'MONTAJ', 'AD', 1.5, 2500, 500),
('CIVATA M8*40 MM AKB', 'MONTAJ', 'AD', 1.5, 2000, 400),
('CIVATA M8*50 MM AKB', 'MONTAJ', 'AD', 1.5, 1500, 300),
('CIVATA M8*60 MM AKB', 'MONTAJ', 'AD', 1.5, 1200, 250),
('CIVATA M5*15 MM YHB', 'MONTAJ', 'AD', 1.0, 4000, 800),
('CIVATA M5*30 MM YHB', 'METALHANE', 'AD', 1.0, 3000, 600),
('CIVATA M8*40 MM YHB', 'MONTAJ', 'AD', 1.5, 2000, 400),
('CIVATA M8*60 MM YHB', 'MONTAJ', 'AD', 1.5, 1500, 300),
('CIVATA M8*70 MM YHB', 'MONTAJ', 'AD', 1.5, 1200, 250),
('CIVATA M8*70 MM AKB', 'MONTAJ', 'AD', 1.5, 1000, 200),
('CIVATA M8*80 MM AKB', 'MONTAJ', 'AD', 1.5, 800, 150),
('METAL PROFIL 20*20*1 MM', 'MONTAJ', 'M', 18.0, 500, 100),
('METAL PROFIL 10*20*1 MM', 'MONTAJ', 'M', 15.0, 600, 120),
('SUNTALAM CEVIZ 600*900*18 MM', 'MONTAJ', 'AD', 100.0, 200, 50),
('TAPA SIYAH 20*20 MM İÇ TAPA', 'MONTAJ', 'AD', 1.0, 3000, 500),
('STRECH', 'AMBALAJ', 'TOP', 150.0, 100, 30),
('FLEXY', 'AMBALAJ', 'M', 4.0, 2000, 400),
('KOSE KORUMA PLASTİGİ', 'AMBALAJ', 'AD', 0.5, 5000, 1000),
('KOLİ BANDI', 'AMBALAJ', 'M', 0.5, 3000, 600);

-- Insert Cargo Prices
INSERT INTO cargo_prices (desi, price) VALUES
(2, 282), (3, 282), (4, 282), (5, 282), (6, 282), (8, 282), (10, 282),
(15, 282), (18, 282), (20, 282), (23, 282), (25, 282), (28, 282), (30, 282),
(35, 286.27), (40, 327.17), (45, 368.06), (50, 408.96), (55, 449.86),
(60, 490.75), (65, 531.65), (70, 572.54), (75, 613.44), (80, 654.34),
(85, 695.23), (90, 736.13), (95, 777.02), (100, 817.92), (110, 899.71),
(120, 981.50), (130, 1063.30), (140, 1145.09), (150, 1226.88), (160, 1308.67),
(170, 1390.46), (180, 1472.26), (190, 1554.05), (200, 1635.84), (210, 1717.63);

-- Insert Sample Customers
INSERT INTO customers (name, email, phone, address, city, district, type, company_name, total_orders, total_spent, status) VALUES
('Ahmet Yılmaz', 'ahmet.yilmaz@email.com', '05321234567', 'Atatürk Cad. No: 15', 'İstanbul', 'Kadıköy', 'individual', NULL, 5, 12500.00, 'active'),
('Mehmet Kaya', 'mehmet.kaya@email.com', '05339876543', 'Cumhuriyet Mah. No: 42', 'Ankara', 'Çankaya', 'individual', NULL, 3, 7800.00, 'active'),
('Ayşe Demir', 'ayse.demir@email.com', '05441112233', 'İstiklal Cad. No: 78', 'İzmir', 'Konak', 'individual', NULL, 8, 21000.00, 'vip'),
('Fatma Şahin', 'fatma.sahin@email.com', '05554443322', 'Barbaros Blv. No: 23', 'Bursa', 'Nilüfer', 'individual', NULL, 2, 3200.00, 'active'),
('Mobilya Plus Ltd. Şti.', 'info@mobilyaplus.com', '02129998877', 'Sanayi Mah. No: 100', 'İstanbul', 'Başakşehir', 'corporate', 'Mobilya Plus Ltd. Şti.', 15, 85000.00, 'vip'),
('Dekorasyon A.Ş.', 'satis@dekorasyon.com', '03124445566', 'OSB 1. Cadde No: 50', 'Ankara', 'Sincan', 'corporate', 'Dekorasyon A.Ş.', 12, 62000.00, 'active'),
('Ali Öztürk', 'ali.ozturk@email.com', '05367778899', 'Yeni Mah. Sok. No: 5', 'Antalya', 'Muratpaşa', 'individual', NULL, 4, 9500.00, 'active'),
('Zeynep Arslan', 'zeynep.arslan@email.com', '05423334455', 'Merkez Mah. No: 33', 'Konya', 'Selçuklu', 'individual', NULL, 6, 15200.00, 'active'),
('Hüseyin Koç', 'huseyin.koc@email.com', '05316667788', 'Bahçelievler Mah. No: 12', 'Gaziantep', 'Şahinbey', 'individual', NULL, 1, 1990.00, 'active'),
('Ev Dekor Tic.', 'bilgi@evdekor.com', '02165554433', 'Ticaret Cad. No: 88', 'İstanbul', 'Ümraniye', 'corporate', 'Ev Dekor Tic.', 20, 120000.00, 'vip');

-- Insert Sample Orders
INSERT INTO orders (order_number, customer_id, customer_name, products, total_amount, total_cost, profit, cargo_cost, sales_channel, status, payment_status, payment_method, shipping_address) 
SELECT 
    'SP-2024-00001',
    c.id,
    'Ahmet Yılmaz',
    '[{"productId": "1", "productName": "TORRE", "quantity": 1, "unitPrice": 2290, "totalPrice": 2290}]'::jsonb,
    2290,
    1203.83,
    804.17,
    282,
    'trendyol',
    'delivered',
    'paid',
    'credit_card',
    'Atatürk Cad. No: 15, Kadıköy, İstanbul'
FROM customers c WHERE c.email = 'ahmet.yilmaz@email.com';

INSERT INTO orders (order_number, customer_id, customer_name, products, total_amount, total_cost, profit, cargo_cost, sales_channel, status, payment_status, payment_method, shipping_address) 
SELECT 
    'SP-2024-00002',
    c.id,
    'Mehmet Kaya',
    '[{"productId": "2", "productName": "VİSİON", "quantity": 1, "unitPrice": 2990, "totalPrice": 2990}]'::jsonb,
    2990,
    1535.00,
    1173.00,
    282,
    'hepsiburada',
    'shipped',
    'paid',
    'credit_card',
    'Cumhuriyet Mah. No: 42, Çankaya, Ankara'
FROM customers c WHERE c.email = 'mehmet.kaya@email.com';

INSERT INTO orders (order_number, customer_id, customer_name, products, total_amount, total_cost, profit, cargo_cost, sales_channel, status, payment_status, payment_method, shipping_address) 
SELECT 
    'SP-2024-00003',
    c.id,
    'Ayşe Demir',
    '[{"productId": "3", "productName": "ORDENADO", "quantity": 2, "unitPrice": 2490, "totalPrice": 4980}]'::jsonb,
    4980,
    2916.22,
    1781.78,
    282,
    'n11',
    'delivered',
    'paid',
    'bank_transfer',
    'İstiklal Cad. No: 78, Konak, İzmir'
FROM customers c WHERE c.email = 'ayse.demir@email.com';

INSERT INTO orders (order_number, customer_id, customer_name, products, total_amount, total_cost, profit, cargo_cost, sales_channel, status, payment_status, payment_method, shipping_address) 
SELECT 
    'SP-2024-00004',
    c.id,
    'Mobilya Plus Ltd. Şti.',
    '[{"productId": "4", "productName": "İMPONENTE", "quantity": 3, "unitPrice": 3990, "totalPrice": 11970}]'::jsonb,
    11970,
    7257.39,
    3731.61,
    327.17,
    'direct',
    'preparing',
    'pending',
    'bank_transfer',
    'Sanayi Mah. No: 100, Başakşehir, İstanbul'
FROM customers c WHERE c.email = 'info@mobilyaplus.com';

INSERT INTO orders (order_number, customer_id, customer_name, products, total_amount, total_cost, profit, cargo_cost, sales_channel, status, payment_status, payment_method, shipping_address) 
SELECT 
    'SP-2024-00005',
    c.id,
    'Ali Öztürk',
    '[{"productId": "5", "productName": "CUBO İKİLİ", "quantity": 2, "unitPrice": 1190, "totalPrice": 2380}]'::jsonb,
    2380,
    790.26,
    1307.74,
    282,
    'vivense',
    'confirmed',
    'paid',
    'credit_card',
    'Yeni Mah. Sok. No: 5, Muratpaşa, Antalya'
FROM customers c WHERE c.email = 'ali.ozturk@email.com';

INSERT INTO orders (order_number, customer_id, customer_name, products, total_amount, total_cost, profit, cargo_cost, sales_channel, status, payment_status, payment_method, shipping_address) 
SELECT 
    'SP-2024-00006',
    c.id,
    'Zeynep Arslan',
    '[{"productId": "6", "productName": "SABİO", "quantity": 1, "unitPrice": 1890, "totalPrice": 1890}]'::jsonb,
    1890,
    1078.13,
    529.87,
    282,
    'bertaconcept',
    'pending',
    'pending',
    'credit_card',
    'Merkez Mah. No: 33, Selçuklu, Konya'
FROM customers c WHERE c.email = 'zeynep.arslan@email.com';

INSERT INTO orders (order_number, customer_id, customer_name, products, total_amount, total_cost, profit, cargo_cost, sales_channel, status, payment_status, payment_method, shipping_address) 
SELECT 
    'SP-2024-00007',
    c.id,
    'Ev Dekor Tic.',
    '[{"productId": "7", "productName": "GATİTO", "quantity": 5, "unitPrice": 1590, "totalPrice": 7950}, {"productId": "8", "productName": "SEGURO", "quantity": 3, "unitPrice": 1740, "totalPrice": 5220}]'::jsonb,
    13170,
    7011.54,
    5876.46,
    564,
    'direct',
    'delivered',
    'paid',
    'bank_transfer',
    'Ticaret Cad. No: 88, Ümraniye, İstanbul'
FROM customers c WHERE c.email = 'bilgi@evdekor.com';

INSERT INTO orders (order_number, customer_id, customer_name, products, total_amount, total_cost, profit, cargo_cost, sales_channel, status, payment_status, payment_method, shipping_address) 
SELECT 
    'SP-2024-00008',
    c.id,
    'Hüseyin Koç',
    '[{"productId": "9", "productName": "MAGO", "quantity": 1, "unitPrice": 1990, "totalPrice": 1990}]'::jsonb,
    1990,
    1154.00,
    508.83,
    327.17,
    'koctas',
    'shipped',
    'paid',
    'cash_on_delivery',
    'Bahçelievler Mah. No: 12, Şahinbey, Gaziantep'
FROM customers c WHERE c.email = 'huseyin.koc@email.com';
