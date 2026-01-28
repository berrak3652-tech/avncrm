// Types for the CRM Application

// Order Status
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

// Payment Status
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

// Payment Method
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'cash_on_delivery';

// Sales Channel
export type SalesChannel = 'trendyol' | 'hepsiburada' | 'n11' | 'ciceksepeti' | 'vivense' | 'bertaconcept' | 'koctas' | 'website' | 'direct';

// Customer Type
export type CustomerType = 'individual' | 'corporate';

// Customer Status
export type CustomerStatus = 'active' | 'inactive' | 'vip';

// Product Status
export type ProductStatus = 'active' | 'inactive';

// Order Product Interface
export interface OrderProduct {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    unitCost: number;
    discount: number;
    totalPrice: number;
    totalCost: number;
}

// Order Interface
export interface Order {
    id: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    products: OrderProduct[];
    totalAmount: number;
    totalCost: number;
    profit: number;
    cargoCost: number;
    salesChannel: SalesChannel;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    shippingAddress: string;
    createdAt: string;
    updatedAt: string;
    shippedAt?: string;
    deliveredAt?: string;
}

// Customer Interface
export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    type: CustomerType;
    taxNumber?: string;
    companyName?: string;
    totalOrders: number;
    totalSpent: number;
    status: CustomerStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Product Interface
export interface Product {
    id: string;
    name: string;
    moduleName: string;
    category: string;
    desi: number;
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    returnCost: number;
    totalCost: number;
    cargoCost: number;
    commission: number;
    taxDifference: number;
    profitMargin: number;
    profit: number;
    salePrice: number;
    vivensePrice: number;
    hepsiburadaPrice: number;
    bertaconceptPrice: number;
    koctasPrice: number;
    stock: number;
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
}

// Material Interface
export interface Material {
    id: string;
    name: string;
    usedIn: string;
    unit: string;
    unitPrice: number;
    stock: number;
    minStock: number;
    createdAt: string;
    updatedAt: string;
}

// Cargo Price Interface
export interface CargoPrice {
    id: string;
    company: string;
    desi: number;
    price: number;
}

// Labor Data Interface
export interface LaborData {
    id: string;
    productName: string;
    moduleName: string;
    piecesPerPerson: number;
    hourlyWage: number;
    totalLabor: number;
}

// Supply Product Interface
export interface SupplyProduct {
    code: string;
    id: string;
    name: string;
    category: string;
    brand: string;
    price: number;
    stock: number;
    tax: number;
    currency: string;
    description: string;
    images: string[];
    cargoCost?: number;
    returnCost?: number;
    profitMargin?: number;
    desi?: number;
    cargoCompany?: string;
}

// Sales Channel Info Interface
export interface SalesChannelInfo {
    id: string;
    name: string;
    commission: number;
    color: string;
}

// Dashboard Stats Interface
export interface DashboardStats {
    totalRevenue: number;
    totalProfit: number;
    totalOrders: number;
    totalCustomers: number;
    pendingOrders: number;
    averageOrderValue: number;
    revenueGrowth: number;
    profitGrowth: number;
}
