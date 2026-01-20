-- Supabase CRM Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    type VARCHAR(20) DEFAULT 'individual' CHECK (type IN ('individual', 'corporate')),
    tax_number VARCHAR(50),
    company_name VARCHAR(255),
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vip')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    module_name VARCHAR(255),
    category VARCHAR(100),
    desi DECIMAL(10,2) DEFAULT 0,
    material_cost DECIMAL(12,2) DEFAULT 0,
    labor_cost DECIMAL(12,2) DEFAULT 0,
    overhead_cost DECIMAL(12,2) DEFAULT 0,
    return_cost DECIMAL(12,2) DEFAULT 0,
    total_cost DECIMAL(12,2) DEFAULT 0,
    cargo_cost DECIMAL(12,2) DEFAULT 0,
    commission DECIMAL(12,2) DEFAULT 0,
    tax_difference DECIMAL(12,2) DEFAULT 0,
    profit_margin DECIMAL(5,4) DEFAULT 0,
    profit DECIMAL(12,2) DEFAULT 0,
    sale_price DECIMAL(12,2) DEFAULT 0,
    vivense_price DECIMAL(12,2) DEFAULT 0,
    hepsiburada_price DECIMAL(12,2) DEFAULT 0,
    bertaconcept_price DECIMAL(12,2) DEFAULT 0,
    koctas_price DECIMAL(12,2) DEFAULT 0,
    stock INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255),
    products JSONB DEFAULT '[]',
    total_amount DECIMAL(12,2) DEFAULT 0,
    total_cost DECIMAL(12,2) DEFAULT 0,
    profit DECIMAL(12,2) DEFAULT 0,
    cargo_cost DECIMAL(12,2) DEFAULT 0,
    sales_channel VARCHAR(50),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'returned')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    payment_method VARCHAR(30),
    shipping_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- Materials Table
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    used_in VARCHAR(100),
    unit VARCHAR(20),
    unit_price DECIMAL(12,2) DEFAULT 0,
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cargo Prices Table
CREATE TABLE IF NOT EXISTS cargo_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    desi INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales Channels Table
CREATE TABLE IF NOT EXISTS sales_channels (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    commission DECIMAL(5,2) DEFAULT 0,
    color VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_type ON customers(type);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_sales_channel ON orders(sales_channel);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_materials_used_in ON materials(used_in);

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargo_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_channels ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for development - adjust for production)
CREATE POLICY "Enable all access for anonymous users" ON customers FOR ALL USING (true);
CREATE POLICY "Enable all access for anonymous users" ON products FOR ALL USING (true);
CREATE POLICY "Enable all access for anonymous users" ON orders FOR ALL USING (true);
CREATE POLICY "Enable all access for anonymous users" ON materials FOR ALL USING (true);
CREATE POLICY "Enable all access for anonymous users" ON cargo_prices FOR ALL USING (true);
CREATE POLICY "Enable all access for anonymous users" ON sales_channels FOR ALL USING (true);

-- Insert default sales channels
INSERT INTO sales_channels (id, name, commission, color) VALUES
    ('trendyol', 'Trendyol', 18, '#F27A1A'),
    ('hepsiburada', 'Hepsiburada', 15, '#FF6000'),
    ('n11', 'N11', 16, '#7D2181'),
    ('ciceksepeti', 'Çiçeksepeti', 17, '#E91E63'),
    ('vivense', 'Vivense', 10, '#00BCD4'),
    ('bertaconcept', 'BertaConcept', 7, '#4CAF50'),
    ('koctas', 'Koçtaş', 12, '#FF9800'),
    ('website', 'Kendi Sitemiz', 0, '#2196F3'),
    ('direct', 'Direkt Satış', 0, '#9C27B0')
ON CONFLICT (id) DO NOTHING;
