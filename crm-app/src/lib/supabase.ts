import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbCustomer {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    district: string | null;
    type: 'individual' | 'corporate';
    tax_number: string | null;
    company_name: string | null;
    total_orders: number;
    total_spent: number;
    status: 'active' | 'inactive' | 'vip';
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbProduct {
    id: string;
    name: string;
    module_name: string;
    category: string;
    desi: number;
    material_cost: number;
    labor_cost: number;
    overhead_cost: number;
    return_cost: number;
    total_cost: number;
    cargo_cost: number;
    commission: number;
    tax_difference: number;
    profit_margin: number;
    profit: number;
    sale_price: number;
    vivense_price: number;
    hepsiburada_price: number;
    bertaconcept_price: number;
    koctas_price: number;
    stock: number;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface DbOrder {
    id: string;
    order_number: string;
    customer_id: string;
    customer_name: string;
    products: any;
    total_amount: number;
    total_cost: number;
    profit: number;
    cargo_cost: number;
    sales_channel: string;
    status: string;
    payment_status: string;
    payment_method: string;
    shipping_address: string;
    created_at: string;
    updated_at: string;
    shipped_at: string | null;
    delivered_at: string | null;
}

export interface DbMaterial {
    id: string;
    name: string;
    used_in: string;
    unit: string;
    unit_price: number;
    stock: number;
    min_stock: number;
    created_at: string;
    updated_at: string;
}

export interface DbLabor {
    id: string;
    product_name: string;
    module_name: string;
    pieces_per_person: number;
    hourly_wage: number;
    total_labor: number;
    created_at: string;
    updated_at: string;
}

// Helper functions for database operations
export const db = {
    // Customers
    async getCustomers() {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as DbCustomer[];
    },

    async createCustomer(customer: Omit<DbCustomer, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('customers')
            .insert(customer)
            .select()
            .single();
        if (error) throw error;
        return data as DbCustomer;
    },

    async updateCustomer(id: string, customer: Partial<DbCustomer>) {
        const { data, error } = await supabase
            .from('customers')
            .update({ ...customer, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as DbCustomer;
    },

    async deleteCustomer(id: string) {
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // Products
    async getProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        return data as DbProduct[];
    },

    async createProduct(product: Omit<DbProduct, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('products')
            .insert(product)
            .select()
            .single();
        if (error) throw error;
        return data as DbProduct;
    },

    async updateProduct(id: string, product: Partial<DbProduct>) {
        const { data, error } = await supabase
            .from('products')
            .update({ ...product, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as DbProduct;
    },

    async deleteProduct(id: string) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // Orders
    async getOrders() {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as DbOrder[];
    },

    async createOrder(order: Omit<DbOrder, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('orders')
            .insert(order)
            .select()
            .single();
        if (error) throw error;
        return data as DbOrder;
    },

    async updateOrder(id: string, order: Partial<DbOrder>) {
        const { data, error } = await supabase
            .from('orders')
            .update({ ...order, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as DbOrder;
    },

    async deleteOrder(id: string) {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // Materials
    async getMaterials() {
        const { data, error } = await supabase
            .from('materials')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        return data as DbMaterial[];
    },

    async createMaterial(material: Omit<DbMaterial, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('materials')
            .insert(material)
            .select()
            .single();
        if (error) throw error;
        return data as DbMaterial;
    },

    async updateMaterial(id: string, material: Partial<DbMaterial>) {
        const { data, error } = await supabase
            .from('materials')
            .update({ ...material, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as DbMaterial;
    },

    async deleteMaterial(id: string) {
        const { error } = await supabase
            .from('materials')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // Labor
    async getLabor() {
        const { data, error } = await supabase
            .from('labor')
            .select('*')
            .order('product_name', { ascending: true });
        if (error) throw error;
        return data as DbLabor[];
    },

    async createLabor(labor: Omit<DbLabor, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('labor')
            .insert(labor)
            .select()
            .single();
        if (error) throw error;
        return data as DbLabor;
    },

    async updateLabor(id: string, labor: Partial<DbLabor>) {
        const { data, error } = await supabase
            .from('labor')
            .update({ ...labor, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as DbLabor;
    },

    async deleteLabor(id: string) {
        const { error } = await supabase
            .from('labor')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};
