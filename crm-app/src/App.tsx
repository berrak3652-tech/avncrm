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
import { BOMPage } from './pages/BOMPage';
import { SuppliesPage } from './pages/SuppliesPage';
import { SUPPLY_PRODUCTS_DATA } from './data/excelData';
import { db } from './lib/supabase';
import { siteDb } from './lib/siteSupabase';
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
  const [dbLabor, setDbLabor] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [useDatabase, setUseDatabase] = useState(true);

  // Fallback mock data
  const mockProducts = useMemo(() => convertToProducts(), []);
  const [mockMaterials, setMockMaterials] = useState(() => convertToMaterials());
  const [mockLabor, setMockLabor] = useState(() => convertToLabor());
  const [mockCargo, setMockCargo] = useState(() => convertToCargoPrices());
  const mockCustomers = useMemo(() => generateMockCustomers(), []);
  const [mockOrders, setMockOrders] = useState(() => generateMockOrders(mockProducts, mockCustomers));

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [customers, products, orders, materials, labor] = await Promise.all([
          db.getCustomers().catch(() => []),
          db.getProducts().catch(() => []),
          db.getOrders().catch(() => []),
          db.getMaterials().catch(() => []),
          db.getLabor().catch(() => [])
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

        const transformedLabor = labor.map((l: any) => ({
          id: l.id,
          productName: l.product_name,
          moduleName: l.module_name || '',
          piecesPerPerson: l.pieces_per_person || 0,
          hourlyWage: l.hourly_wage || 0,
          totalLabor: l.total_labor || 0,
          createdAt: l.created_at,
          updatedAt: l.updated_at
        }));

        setDbCustomers(transformedCustomers);
        setDbProducts(transformedProducts);
        setDbOrders(transformedOrders);
        setDbMaterials(transformedMaterials);
        setDbLabor(transformedLabor);

        // Use database if we got data, otherwise use mock
        setUseDatabase(customers.length > 0 || products.length > 0 || orders.length > 0 || labor.length > 0);

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
  const laborData = useDatabase && dbLabor.length > 0 ? dbLabor : mockLabor;
  const [dbCargo, setDbCargo] = useState<any[]>([]);
  const cargoPrices = useDatabase && dbCargo.length > 0 ? dbCargo : mockCargo; // Corrected cargoPrices mapping

  const handleUpdateMaterial = async (updatedMaterial: any) => {
    const isMock = typeof updatedMaterial.id === 'string' && updatedMaterial.id.startsWith('MAT-');
    if (useDatabase && !isMock) {
      try {
        await db.updateMaterial(updatedMaterial.id, {
          name: updatedMaterial.name,
          used_in: updatedMaterial.usedIn,
          unit: updatedMaterial.unit,
          unit_price: updatedMaterial.unitPrice,
          stock: updatedMaterial.stock
        });
        setDbMaterials(prev => prev.map(m => m.id === updatedMaterial.id ? updatedMaterial : m));
      } catch (error) {
        console.error('Error updating material:', error);
      }
    } else {
      setMockMaterials(prev => prev.map(m => m.id === updatedMaterial.id ? updatedMaterial : m));
    }
  };

  const handleUpdateAllCargoPrices = async (percentage: number, fixedAdd: number, company: string, setPrice?: number, thresholdConfig?: { threshold: number, basePrice: number, perDesi: number }) => {
    const updateLogic = (p: any) => {
      // 1. If threshold pricing is used (Highest priority)
      if (thresholdConfig && thresholdConfig.basePrice > 0) {
        if (p.desi <= thresholdConfig.threshold) {
          return thresholdConfig.basePrice;
        } else {
          const extraDesi = p.desi - thresholdConfig.threshold;
          return thresholdConfig.basePrice + (extraDesi * thresholdConfig.perDesi);
        }
      }

      // 2. If global fixed price is set
      if (setPrice && setPrice > 0) return setPrice;

      // 3. Percentage or fixed addition to existing prices
      let newPrice = p.price;
      if (percentage !== 0) newPrice = newPrice * (1 + percentage / 100);
      if (fixedAdd !== 0) newPrice = newPrice + fixedAdd;
      return Number(newPrice.toFixed(2));
    };

    if (company.startsWith('NEW:')) {
      const newName = company.replace('NEW:', '');
      setMockCargo(prev => {
        const sourceCompany = prev.find(p => p.company === 'Horoz Lojistik') ? 'Horoz Lojistik' : prev[0].company;
        const template = prev.filter(p => p.company === sourceCompany);
        const newPrices = template.map((p, i) => ({
          ...p,
          id: `CGO-NEW-${Date.now()}-${i}`,
          company: newName,
          price: p.price
        }));
        return [...prev, ...newPrices];
      });
      return;
    }

    if (useDatabase && dbCargo.length > 0) {
      alert('Veritabanı güncelleme özelliği planlanıyor.');
    } else {
      setMockCargo(prev => prev.map(p => {
        if (p.company === company) {
          return { ...p, price: updateLogic(p) };
        }
        return p;
      }));
    }
  };

  const handleUpdateCargoPrice = (updatedPrice: any) => {
    setMockCargo(prev => prev.map(p => p.id === updatedPrice.id ? updatedPrice : p));
  };

  const handleResetCargoPrices = (company: string) => {
    // Get fresh data from original Excel source (via helpers)
    const allOriginal = convertToCargoPrices();
    const originalForCompany = allOriginal.filter(p => p.company === company);

    if (originalForCompany.length > 0) {
      setMockCargo(prev => [
        ...prev.filter(p => p.company !== company),
        ...originalForCompany
      ]);
    } else {
      alert(`${company} firması orijinal Excel verilerinde bulunamadı.`);
    }
  };

  const handleUpdateLabor = async (updatedLabor: any) => {
    const isMock = typeof updatedLabor.id === 'string' && updatedLabor.id.startsWith('LBR-');
    if (useDatabase && !isMock) {
      try {
        await db.updateLabor(updatedLabor.id, {
          pieces_per_person: updatedLabor.piecesPerPerson,
          hourly_wage: updatedLabor.hourlyWage,
          total_labor: updatedLabor.totalLabor
        });
        setDbLabor(prev => prev.map(l => l.id === updatedLabor.id ? updatedLabor : l));
      } catch (error) {
        console.error('Error updating labor:', error);
      }
    } else {
      setMockLabor(prev => prev.map(l => l.id === updatedLabor.id ? updatedLabor : l));
    }
  };

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


  const handleSyncSiteOrders = async () => {
    try {
      const siteOrders = await siteDb.getOrders();
      if (!siteOrders || siteOrders.length === 0) return;

      const newOrders = siteOrders.map((so: any) => {
        // Find or create customer (skipping for now, just mapping names)
        const products = so.order_items.map((item: any) => ({
          productId: item.product_id,
          productName: item.product_name || 'Web Ürünü', // We might need to fetch names if missing
          quantity: item.quantity,
          unitPrice: item.price,
          unitCost: 0, // Site doesn't have cost, we might need to map from our products
          totalPrice: item.price * item.quantity,
          totalCost: 0
        }));

        return {
          id: so.id,
          orderNumber: `WS-${so.id.slice(0, 8)}`,
          customerId: so.customer_id || '',
          customerName: so.customer_name,
          products: products,
          totalAmount: so.total_amount,
          totalCost: 0,
          profit: 0,
          cargoCost: 0,
          salesChannel: 'website',
          status: so.status || 'pending',
          paymentStatus: 'paid', // Assuming web orders are paid
          paymentMethod: 'Kredi Kartı',
          shippingAddress: so.address,
          createdAt: so.created_at,
          updatedAt: so.created_at
        };
      });

      if (useDatabase) {
        // Upsert into our orders table
        for (const order of newOrders) {
          const dbOrder = {
            order_number: order.orderNumber,
            customer_id: null,
            customer_name: order.customerName,
            products: order.products,
            total_amount: order.totalAmount,
            total_cost: 0,
            profit: 0,
            cargo_cost: 0,
            sales_channel: 'website',
            status: order.status,
            payment_status: order.paymentStatus,
            payment_method: order.paymentMethod,
            shipping_address: order.shippingAddress,
            created_at: order.createdAt,
            updated_at: order.updatedAt,
            shipped_at: null,
            delivered_at: null
          };
          await db.createOrder(dbOrder).catch(() => { }); // Simple catch for existing ones
        }
        // Reload orders
        const updatedOrders = await db.getOrders();
        // (Transformation logic repeated here or extracted)
        setDbOrders(updatedOrders.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          customerId: o.customer_id,
          customerName: o.customer_name || '',
          products: o.products || [],
          totalAmount: o.total_amount || 0,
          totalCost: o.total_cost || 0,
          profit: o.profit || 0,
          cargo_cost: o.cargo_cost || 0,
          salesChannel: o.sales_channel || 'direct',
          status: o.status,
          paymentStatus: o.payment_status,
          paymentMethod: o.payment_method,
          shippingAddress: o.shipping_address || '',
          createdAt: o.created_at,
          updatedAt: o.updated_at,
          shippedAt: o.shipped_at || null,
          deliveredAt: o.delivered_at || null
        })));
      } else {
        setMockOrders(prev => [
          ...newOrders
            .filter((no: any) => !prev.some(p => p.id === no.id))
            .map((no: any) => ({ ...no, shippedAt: null, deliveredAt: null })),
          ...prev
        ]);
      }
      alert(`${newOrders.length} sipariş başarıyla senkronize edildi.`);
    } catch (error) {
      console.error('Sync error:', error);
      alert('Siparişler çekilirken bir hata oluştu.');
    }
  };

  const handleSyncProductToSite = async (product: any) => {
    try {
      const siteProduct = {
        id: product.id,
        name: product.name,
        price: product.salePrice,
        category: product.category,
        description: `${product.moduleName} - Avyna Concept`,
        stock: product.stock,
        modelurl: '',
        dimensions: { desi: product.desi },
        images: []
      };

      // Try to find if product exists on site
      const existingProducts = await siteDb.getProducts();
      const existing = existingProducts.find((p: any) => p.id === product.id || p.name === product.name);

      if (existing) {
        await siteDb.updateProduct(existing.id, siteProduct);
        alert(`${product.name} web sitesinde başarıyla güncellendi.`);
      } else {
        await siteDb.createProduct(siteProduct);
        alert(`${product.name} web sitesine yeni ürün olarak eklendi.`);
      }
    } catch (error) {
      console.error('Product sync error:', error);
      alert('Ürün senkronize edilirken bir hata oluştu.');
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
            element={
              <ProductsPage
                products={products}
                onSyncToSite={handleSyncProductToSite}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <OrdersPage
                orders={orders}
                onUpdateOrder={handleUpdateOrder}
                onSyncSiteOrders={handleSyncSiteOrders}
              />
            }
          />
          <Route
            path="/customers"
            element={<CustomersPage customers={customers} />}
          />
          <Route
            path="/materials"
            element={<MaterialsPage materials={materials} onUpdateMaterial={handleUpdateMaterial} />}
          />
          <Route
            path="/cargo"
            element={
              <CargoPage
                cargoPrices={cargoPrices}
                onUpdateAllPrices={handleUpdateAllCargoPrices}
                onResetAllPrices={handleResetCargoPrices}
                onUpdatePrice={handleUpdateCargoPrice}
              />
            }
          />
          <Route
            path="/labor"
            element={<LaborPage laborData={laborData} onUpdateLabor={handleUpdateLabor} />}
          />
          <Route
            path="/bom"
            element={<BOMPage products={products} />}
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
            path="/supplies"
            element={<SuppliesPage supplies={SUPPLY_PRODUCTS_DATA as any} />}
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
