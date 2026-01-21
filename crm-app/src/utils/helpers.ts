import { SALES_PRICES_DATA, MATERIALS_DATA, CARGO_PRICES_DATA, LABOR_DATA, SALES_CHANNELS } from '../data/excelData';

// Generate unique ID
export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Format currency
export const formatCurrency = (amount: number, currency: string = '₺'): string => {
    return `${currency}${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Format number
export const formatNumber = (num: number): string => {
    return num.toLocaleString('tr-TR');
};

// Format percentage
export const formatPercentage = (value: number): string => {
    return `%${(value * 100).toFixed(1)}`;
};

// Format date
export const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Format datetime
export const formatDateTime = (date: string | Date): string => {
    return new Date(date).toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Calculate cargo cost based on desi
export const calculateCargoCost = (desi: number): number => {
    const sortedPrices = [...CARGO_PRICES_DATA].sort((a, b) => a.desi - b.desi);
    for (const price of sortedPrices) {
        if (desi <= price.desi) {
            return price.price;
        }
    }
    return sortedPrices[sortedPrices.length - 1].price;
};

// Get channel by ID
export const getChannelById = (id: string) => {
    return SALES_CHANNELS.find(c => c.id === id);
};

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
type SalesChannel = 'trendyol' | 'hepsiburada' | 'n11' | 'ciceksepeti' | 'vivense' | 'bertaconcept' | 'koctas' | 'website' | 'direct';

// Get order status color
export const getOrderStatusColor = (status: OrderStatus): string => {
    const colors: Record<OrderStatus, string> = {
        pending: 'badge-warning',
        confirmed: 'badge-info',
        preparing: 'badge-primary',
        shipped: 'badge-info',
        delivered: 'badge-success',
        cancelled: 'badge-error',
        returned: 'badge-error'
    };
    return colors[status] || 'badge-primary';
};

// Get order status text
export const getOrderStatusText = (status: OrderStatus): string => {
    const texts: Record<OrderStatus, string> = {
        pending: 'Beklemede',
        confirmed: 'Onaylandı',
        preparing: 'Hazırlanıyor',
        shipped: 'Kargoya Verildi',
        delivered: 'Teslim Edildi',
        cancelled: 'İptal Edildi',
        returned: 'İade Edildi'
    };
    return texts[status] || status;
};

// Channel name mapping
export const getChannelName = (channel: SalesChannel): string => {
    const names: Record<SalesChannel, string> = {
        trendyol: 'Trendyol',
        hepsiburada: 'Hepsiburada',
        n11: 'N11',
        ciceksepeti: 'Çiçeksepeti',
        vivense: 'Vivense',
        bertaconcept: 'ÇınarConcept',
        koctas: 'Koçtaş',
        website: 'Web Sitesi',
        direct: 'Direkt Satış'
    };
    return names[channel] || channel;
};

// Get category from module name
const getCategoryFromModuleName = (moduleName: string): string => {
    const lower = moduleName.toLowerCase();
    if (lower.includes('çalışma') || lower.includes('laptop') || lower.includes('masa')) return 'Çalışma Masası';
    if (lower.includes('tv')) return 'TV Ünitesi';
    if (lower.includes('kitaplık')) return 'Kitaplık';
    if (lower.includes('tabure')) return 'Tabure';
    if (lower.includes('oturak')) return 'Oturak';
    if (lower.includes('bahçe') || lower.includes('balkon')) return 'Bahçe Mobilyası';
    if (lower.includes('piknik') || lower.includes('kamp')) return 'Kamp Ürünleri';
    return 'Diğer';
};

// Convert Excel data to products
export const convertToProducts = () => {
    return SALES_PRICES_DATA.map((item, index) => ({
        id: `PRD-${String(index + 1).padStart(4, '0')}`,
        name: item.name,
        moduleName: item.moduleName,
        category: getCategoryFromModuleName(item.moduleName),
        desi: item.desi,
        materialCost: item.materialCost,
        laborCost: item.laborCost,
        overheadCost: item.overheadCost,
        returnCost: item.returnCost,
        totalCost: item.totalCost,
        cargoCost: item.cargoCost,
        commission: item.commission,
        taxDifference: item.taxDiff,
        profitMargin: item.profitMargin,
        profit: item.profit,
        salePrice: item.salePrice,
        vivensePrice: item.vivense,
        hepsiburadaPrice: item.hepsiburada,
        bertaconceptPrice: item.bertaconcept,
        koctasPrice: item.koctas,
        stock: Math.floor(Math.random() * 50) + 5,
        status: item.salePrice > 0 ? 'active' as const : 'inactive' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }));
};

// Convert Excel data to materials
export const convertToMaterials = () => {
    return MATERIALS_DATA.map((item, index) => ({
        id: `MAT-${String(index + 1).padStart(4, '0')}`,
        name: item.name,
        usedIn: item.usedIn,
        unit: item.unit,
        unitPrice: item.unitPrice,
        stock: Math.floor(Math.random() * 1000) + 100,
        minStock: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }));
};

// Convert Excel data to cargo prices
export const convertToCargoPrices = () => {
    return CARGO_PRICES_DATA.map((item, index) => ({
        id: `CGO-${String(index + 1).padStart(4, '0')}`,
        desi: item.desi,
        price: item.price
    }));
};

// Convert Excel data to labor
export const convertToLabor = () => {
    return LABOR_DATA.map((item, index) => ({
        id: `LBR-${String(index + 1).padStart(4, '0')}`,
        productName: item.productName,
        moduleName: item.moduleName,
        piecesPerPerson: item.piecesPerPerson,
        hourlyWage: item.hourlyWage,
        totalLabor: item.totalLabor
    }));
};

// Generate mock customers
export const generateMockCustomers = () => {
    const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Gaziantep'];
    const firstNames = ['Ahmet', 'Mehmet', 'Ali', 'Ayşe', 'Fatma', 'Zeynep', 'Mustafa', 'Hüseyin', 'Elif', 'Merve'];
    const lastNames = ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Öztürk', 'Aydın', 'Özdemir', 'Arslan', 'Koç'];

    return Array.from({ length: 50 }, (_, i) => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const isCorporate = Math.random() > 0.7;
        const statusOptions = ['active', 'active', 'active', 'inactive', 'vip'] as const;

        return {
            id: `CUS-${String(i + 1).padStart(4, '0')}`,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
            phone: `05${Math.floor(Math.random() * 100000000 + 300000000)}`,
            address: `${['Atatürk', 'Cumhuriyet', 'İstiklal', 'Barbaros'][Math.floor(Math.random() * 4)]} Cad. No: ${Math.floor(Math.random() * 100) + 1}`,
            city: city,
            district: `${city} Merkez`,
            type: isCorporate ? 'corporate' as const : 'individual' as const,
            taxNumber: isCorporate ? `${Math.floor(Math.random() * 10000000000)}` : undefined,
            companyName: isCorporate ? `${lastName} ${['Ltd. Şti.', 'A.Ş.', 'Tic.'][Math.floor(Math.random() * 3)]}` : undefined,
            totalOrders: Math.floor(Math.random() * 20),
            totalSpent: Math.floor(Math.random() * 50000),
            status: statusOptions[Math.floor(Math.random() * 5)],
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
        };
    });
};

// Generate mock orders
export const generateMockOrders = (products: any[], customers: any[]) => {
    const channels = ['trendyol', 'hepsiburada', 'n11', 'vivense', 'bertaconcept', 'koctas', 'website', 'direct'] as const;
    const statuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'] as const;
    const paymentMethods = ['credit_card', 'bank_transfer', 'cash_on_delivery'] as const;

    return Array.from({ length: 100 }, (_, i) => {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const numProducts = Math.floor(Math.random() * 3) + 1;
        const activeProducts = products.filter((p: any) => p.salePrice > 0);
        const orderProducts = Array.from({ length: numProducts }, () => {
            const product = activeProducts[Math.floor(Math.random() * activeProducts.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 15) : 0;

            return {
                productId: product.id,
                productName: product.name,
                quantity,
                unitPrice: product.salePrice,
                unitCost: product.totalCost,
                discount,
                totalPrice: product.salePrice * quantity * (1 - discount / 100),
                totalCost: product.totalCost * quantity
            };
        });

        const totalAmount = orderProducts.reduce((sum, p) => sum + p.totalPrice, 0);
        const totalCost = orderProducts.reduce((sum, p) => sum + p.totalCost, 0);
        const cargoCost = 282;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const createdAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);

        return {
            id: `ORD-${String(i + 1).padStart(5, '0')}`,
            orderNumber: `SP-2024-${String(i + 1).padStart(5, '0')}`,
            customerId: customer.id,
            customerName: customer.name,
            products: orderProducts,
            totalAmount,
            totalCost,
            profit: totalAmount - totalCost - cargoCost,
            cargoCost,
            salesChannel: channels[Math.floor(Math.random() * channels.length)],
            status,
            paymentStatus: status === 'delivered' ? 'paid' as const : (Math.random() > 0.5 ? 'paid' as const : 'pending' as const),
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            shippingAddress: `${customer.address}, ${customer.district}, ${customer.city}`,
            createdAt: createdAt.toISOString(),
            updatedAt: new Date().toISOString(),
            shippedAt: status === 'shipped' || status === 'delivered' ? new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
            deliveredAt: status === 'delivered' ? new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() : undefined
        };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Search filter
export const searchFilter = <T extends object>(items: T[], query: string, fields: (keyof T)[]): T[] => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase().trim();
    return items.filter(item =>
        fields.some(field => {
            const value = item[field];
            return value && String(value).toLowerCase().includes(lowerQuery);
        })
    );
};

// Calculate dashboard stats
export const calculateDashboardStats = (orders: any[], customers: any[]) => {
    const now = new Date();
    const thisMonth = orders.filter((o: any) => new Date(o.createdAt).getMonth() === now.getMonth());
    const lastMonth = orders.filter((o: any) => {
        const date = new Date(o.createdAt);
        return date.getMonth() === now.getMonth() - 1 || (now.getMonth() === 0 && date.getMonth() === 11);
    });

    const thisMonthRevenue = thisMonth.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
    const lastMonthRevenue = lastMonth.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
    const thisMonthProfit = thisMonth.reduce((sum: number, o: any) => sum + o.profit, 0);
    const lastMonthProfit = lastMonth.reduce((sum: number, o: any) => sum + o.profit, 0);

    return {
        totalRevenue: orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0),
        totalProfit: orders.reduce((sum: number, o: any) => sum + o.profit, 0),
        totalOrders: orders.length,
        totalCustomers: customers.length,
        pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
        averageOrderValue: orders.length > 0 ? orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0) / orders.length : 0,
        revenueGrowth: lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0,
        profitGrowth: lastMonthProfit > 0 ? ((thisMonthProfit - lastMonthProfit) / lastMonthProfit) * 100 : 0
    };
};
