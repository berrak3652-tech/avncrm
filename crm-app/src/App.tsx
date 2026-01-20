import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { CustomersPage } from './pages/CustomersPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { CargoPage } from './pages/CargoPage';
import { LaborPage } from './pages/LaborPage';
import { ReportsPage } from './pages/ReportsPage';
import { ChannelsPage } from './pages/ChannelsPage';
import { SettingsPage } from './pages/SettingsPage';
import { db } from './lib/supabase';
import {
  convertToProducts,
  convertToMaterials,
  convertToCargoPrices,
  convertToLabor,
  generateMockCustomers,
  generateMockOrders
} from './utils/helpers';

function App() {
  // State for database data
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbMaterials, setDbMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [useDatabase, setUseDatabase] = useState(true);

  // Fallback mock data
  const mockProducts = useMemo(() => convertToProducts(), []);
  const mockMaterials = useMemo(() => convertToMaterials(), []);
  const cargoPrices = useMemo(() => convertToCargoPrices(), []);
  const laborData = useMemo(() => convertToLabor(), []);
  const mockCustomers = useMemo(() => generateMockCustomers(), []);
  const [mockOrders, setMockOrders] = useState(() => generateMockOrders(mockProducts, mockCustomers));

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [customers, products, orders, materials] = await Promise.all([
          db.getCustomers().catch(() => []),
          db.getProducts().catch(() => []),
          db.getOrders().catch(() => []),
          db.getMaterials().catch(() => [])
        ]);

        // Transform database data to match app format
        const transformedCustomers = customers.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email || '',
          phone: c.phone || '',
          address: c.address || '',
          city: c.city || '',
          district: c.district || '',
          type: c.type,
          taxNumber: c.tax_number,
          companyName: c.company_name,
          totalOrders: c.total_orders || 0,
          totalSpent: c.total_spent || 0,
          status: c.status,
          notes: c.notes,
          createdAt: c.created_at,
          updatedAt: c.updated_at
        }));

        const transformedProducts = products.map((p: any) => ({
          id: p.id,
          name: p.name,
          moduleName: p.module_name || '',
          category: p.category || '',
          desi: p.desi || 0,
          materialCost: p.material_cost || 0,
          laborCost: p.labor_cost || 0,
          overheadCost: p.overhead_cost || 0,
          returnCost: p.return_cost || 0,
          totalCost: p.total_cost || 0,
          cargoCost: p.cargo_cost || 0,
          commission: p.commission || 0,
          taxDifference: p.tax_difference || 0,
          profitMargin: p.profit_margin || 0,
          profit: p.profit || 0,
          salePrice: p.sale_price || 0,
          vivensePrice: p.vivense_price || 0,
          hepsiburadaPrice: p.hepsiburada_price || 0,
          bertaconceptPrice: p.bertaconcept_price || 0,
          koctasPrice: p.koctas_price || 0,
          stock: p.stock || 0,
          status: p.status,
          createdAt: p.created_at,
          updatedAt: p.updated_at
        }));

        const transformedOrders = orders.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          customerId: o.customer_id,
          customerName: o.customer_name || '',
          products: o.products || [],
          totalAmount: o.total_amount || 0,
          totalCost: o.total_cost || 0,
          profit: o.profit || 0,
          cargoCost: o.cargo_cost || 0,
          salesChannel: o.sales_channel || 'direct',
          status: o.status,
          paymentStatus: o.payment_status,
          paymentMethod: o.payment_method,
          shippingAddress: o.shipping_address || '',
          createdAt: o.created_at,
          updatedAt: o.updated_at,
          shippedAt: o.shipped_at,
          deliveredAt: o.delivered_at
        }));

        const transformedMaterials = materials.map((m: any) => ({
          id: m.id,
          name: m.name,
          usedIn: m.used_in || '',
          unit: m.unit || '',
          unitPrice: m.unit_price || 0,
          stock: m.stock || 0,
          minStock: m.min_stock || 50,
          createdAt: m.created_at,
          updatedAt: m.updated_at
        }));

        setDbCustomers(transformedCustomers);
        setDbProducts(transformedProducts);
        setDbOrders(transformedOrders);
        setDbMaterials(transformedMaterials);

        // Use database if we got data, otherwise use mock
        setUseDatabase(customers.length > 0 || products.length > 0 || orders.length > 0);

      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        setUseDatabase(false);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Use database data if available, otherwise fall back to mock data
  const customers = useDatabase && dbCustomers.length > 0 ? dbCustomers : mockCustomers;
  const products = useDatabase && dbProducts.length > 0 ? dbProducts : mockProducts;
  const orders = useDatabase && dbOrders.length > 0 ? dbOrders : mockOrders;
  const materials = useDatabase && dbMaterials.length > 0 ? dbMaterials : mockMaterials;

  const handleUpdateOrder = async (updatedOrder: any) => {
    if (useDatabase) {
      try {
        await db.updateOrder(updatedOrder.id, {
          status: updatedOrder.status,
          payment_status: updatedOrder.paymentStatus,
          shipped_at: updatedOrder.shippedAt,
          delivered_at: updatedOrder.deliveredAt
        });
        setDbOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      } catch (error) {
        console.error('Error updating order:', error);
      }
    } else {
      setMockOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--dark-bg)',
        color: 'var(--gray-300)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid var(--dark-border)',
            borderTop: '3px solid var(--primary-500)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Veriler yükleniyor...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                products={products}
                orders={orders}
                customers={customers}
              />
            }
          />
          <Route
            path="/products"
            element={<ProductsPage products={products} />}
          />
          <Route
            path="/orders"
            element={
              <OrdersPage
                orders={orders}
                onUpdateOrder={handleUpdateOrder}
              />
            }
          />
          <Route
            path="/customers"
            element={<CustomersPage customers={customers} />}
          />
          <Route
            path="/materials"
            element={<MaterialsPage materials={materials} />}
          />
          <Route
            path="/cargo"
            element={<CargoPage cargoPrices={cargoPrices} />}
          />
          <Route
            path="/labor"
            element={<LaborPage laborData={laborData} />}
          />
          <Route
            path="/reports"
            element={<ReportsPage orders={orders} />}
          />
          <Route
            path="/analytics"
            element={<ReportsPage orders={orders} />}
          />
          <Route
            path="/channels"
            element={<ChannelsPage orders={orders} />}
          />
          <Route
            path="/settings"
            element={<SettingsPage />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
