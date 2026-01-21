import { createClient } from '@supabase/supabase-js';

const siteSupabaseUrl = import.meta.env.VITE_SITE_SUPABASE_URL;
const siteSupabaseAnonKey = import.meta.env.VITE_SITE_SUPABASE_ANON_KEY;

export const siteSupabase = createClient(siteSupabaseUrl, siteSupabaseAnonKey);

export const siteDb = {
    // Get orders from website
    async getOrders() {
        const { data, error } = await siteSupabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    // Get products from website
    async getProducts() {
        const { data, error } = await siteSupabase
            .from('products')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        return data;
    },

    // Create product on website
    async createProduct(product: any) {
        const { data, error } = await siteSupabase
            .from('products')
            .insert(product)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Update product on website
    async updateProduct(id: string, updates: any) {
        const { data, error } = await siteSupabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};
