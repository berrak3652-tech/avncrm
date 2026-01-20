# 🏢 Berta CRM - Satış & Müşteri Yönetimi

Modern, hızlı ve kullanıcı dostu bir CRM (Müşteri İlişkileri Yönetimi) uygulaması. React + TypeScript + Supabase ile geliştirilmiştir.

![Berta CRM Dashboard](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)

## ✨ Özellikler

### 📊 Dashboard
- Toplam gelir, kar, sipariş ve müşteri istatistikleri
- Gelir & Kar trend grafiği
- Satış kanalları pasta grafiği
- En çok satan ürünler listesi
- Son siparişler tablosu

### 📦 Ürün Yönetimi
- 24+ ürün kategorisi
- Maliyet analizi (malzeme, işçilik, genel gider)
- Satış kanalı bazlı fiyatlandırma
- Stok takibi
- Kar marjı hesaplama

### 🛒 Sipariş Yönetimi
- Sipariş durumu takibi
- Ödeme durumu yönetimi
- Kargo takibi
- Satış kanalı filtreleme

### 👥 Müşteri Yönetimi
- Bireysel ve kurumsal müşteriler
- VIP müşteri takibi
- Sipariş geçmişi
- İletişim bilgileri

### 🔧 Malzeme Yönetimi
- Hammadde stok takibi
- Minimum stok uyarıları
- Departman bazlı malzeme listesi

### 📈 Raporlar & Analizler
- Aylık gelir/kar raporları
- Kanal bazlı performans analizi
- Kar marjı karşılaştırmaları

## 🛠️ Teknolojiler

| Teknoloji | Açıklama |
|-----------|----------|
| **React 18** | UI Framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool & Dev server |
| **Supabase** | PostgreSQL veritabanı & Auth |
| **React Router** | Sayfa yönlendirme |
| **Recharts** | Grafik kütüphanesi |
| **Lucide React** | İkon kütüphanesi |

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase hesabı

### Adımlar

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/berrak3652-tech/avncrm.git
cd avncrm/crm-app
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment dosyasını oluşturun:**
```bash
cp .env.example .env
```

4. **Supabase bilgilerinizi ekleyin:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. **Supabase'de tabloları oluşturun:**
   - `supabase/schema.sql` dosyasını SQL Editor'da çalıştırın
   - `supabase/complete_setup.sql` dosyasını çalıştırın (veriler dahil)

6. **Uygulamayı başlatın:**
```bash
npm run dev
```

7. **Tarayıcıda açın:**
```
http://localhost:5173
```

## 📁 Proje Yapısı

```
avncrm/
├── crm-app/
│   ├── src/
│   │   ├── components/      # UI bileşenleri
│   │   │   └── Layout.tsx   # Ana layout
│   │   ├── pages/           # Sayfa bileşenleri
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── CustomersPage.tsx
│   │   │   ├── MaterialsPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── supabase.ts  # Supabase client
│   │   ├── utils/
│   │   │   └── helpers.ts   # Yardımcı fonksiyonlar
│   │   ├── data/
│   │   │   └── excelData.ts # Excel verileri
│   │   ├── types.ts         # TypeScript tipleri
│   │   ├── App.tsx          # Ana App bileşeni
│   │   └── main.tsx         # Entry point
│   ├── supabase/
│   │   ├── schema.sql       # Veritabanı şeması
│   │   ├── seed.sql         # Örnek veriler
│   │   └── complete_setup.sql # Tam kurulum
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🗄️ Veritabanı Şeması

### Tablolar
- `customers` - Müşteri bilgileri
- `products` - Ürün kataloğu
- `orders` - Siparişler
- `materials` - Hammaddeler
- `cargo_prices` - Kargo fiyatları
- `sales_channels` - Satış kanalları

## 🎨 Ekran Görüntüleri

### Dashboard
- İstatistik kartları
- Trend grafikleri
- Satış kanalı dağılımı

### Ürünler
- Ürün listesi
- Fiyat ve maliyet bilgileri
- Stok durumu

### Siparişler
- Sipariş tablosu
- Durum filtreleme
- Detay görüntüleme

## 🔐 Güvenlik

- Supabase Row Level Security (RLS) aktif
- Environment variables ile credential yönetimi
- `.env` dosyası gitignore'da

## 📝 Lisans

MIT License

## 👨‍💻 Geliştirici

**Berta Tech**

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
