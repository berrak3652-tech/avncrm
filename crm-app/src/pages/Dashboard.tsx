import React, { useMemo } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    Clock,
    BarChart3,
    ArrowRight,
    Eye
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import {
    formatCurrency,
    calculateDashboardStats,
    getChannelName,
    getOrderStatusText,
    getOrderStatusColor,
    formatDate
} from '../utils/helpers';
import { SALES_CHANNELS } from '../data/excelData';

interface DashboardProps {
    products: any[];
    orders: any[];
    customers: any[];
}

export const Dashboard: React.FC<DashboardProps> = ({ products, orders, customers }) => {
    const stats = useMemo(() => calculateDashboardStats(orders, customers), [orders, customers]);

    // Monthly sales data for chart
    const monthlySalesData = useMemo(() => {
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        const now = new Date();

        return Array.from({ length: 6 }, (_, i) => {
            const monthIndex = (now.getMonth() - 5 + i + 12) % 12;
            const monthOrders = orders.filter(o => new Date(o.createdAt).getMonth() === monthIndex);
            return {
                name: months[monthIndex],
                gelir: monthOrders.reduce((sum, o) => sum + o.totalAmount, 0),
                kar: monthOrders.reduce((sum, o) => sum + o.profit, 0)
            };
        });
    }, [orders]);

    // Sales by channel
    const channelSalesData = useMemo(() => {
        const channelData: Record<string, { sales: number; revenue: number }> = {};

        orders.forEach(order => {
            if (!channelData[order.salesChannel]) {
                channelData[order.salesChannel] = { sales: 0, revenue: 0 };
            }
            channelData[order.salesChannel].sales += 1;
            channelData[order.salesChannel].revenue += order.totalAmount;
        });

        return Object.entries(channelData)
            .map(([channel, data]) => ({
                name: getChannelName(channel as any),
                value: data.revenue,
                sales: data.sales,
                color: SALES_CHANNELS.find(c => c.id === channel)?.color || '#6366F1'
            }))
            .sort((a, b) => b.value - a.value);
    }, [orders]);

    // Top products
    const topProducts = useMemo(() => {
        const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};

        orders.forEach(order => {
            order.products.forEach(product => {
                if (!productSales[product.productId]) {
                    productSales[product.productId] = { name: product.productName, quantity: 0, revenue: 0 };
                }
                productSales[product.productId].quantity += product.quantity;
                productSales[product.productId].revenue += product.totalPrice;
            });
        });

        return Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    }, [orders]);

    // Recent orders
    const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

    return (
        <div>
            {/* Stats Grid */}
            <div className="grid grid-4 mb-6">
                <StatCard
                    icon={<DollarSign size={24} />}
                    iconBg="linear-gradient(135deg, var(--primary-500), var(--primary-600))"
                    value={formatCurrency(stats.totalRevenue)}
                    label="Toplam Gelir"
                    trend={stats.revenueGrowth}
                    trendLabel="geçen aya göre"
                />
                <StatCard
                    icon={<TrendingUp size={24} />}
                    iconBg="linear-gradient(135deg, var(--secondary-500), var(--secondary-600))"
                    value={formatCurrency(stats.totalProfit)}
                    label="Toplam Kar"
                    trend={stats.profitGrowth}
                    trendLabel="geçen aya göre"
                />
                <StatCard
                    icon={<ShoppingCart size={24} />}
                    iconBg="linear-gradient(135deg, var(--accent-500), var(--accent-600))"
                    value={stats.totalOrders.toString()}
                    label="Toplam Sipariş"
                    trend={null}
                    subValue={`${stats.pendingOrders} beklemede`}
                />
                <StatCard
                    icon={<Users size={24} />}
                    iconBg="linear-gradient(135deg, #8B5CF6, #7C3AED)"
                    value={stats.totalCustomers.toString()}
                    label="Toplam Müşteri"
                    trend={null}
                    subValue={formatCurrency(stats.averageOrderValue) + ' ort. sepet'}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-2 mb-6">
                {/* Revenue Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Gelir & Kar Trendi</h3>
                        <button className="btn btn-ghost btn-sm">
                            <Eye size={16} />
                            Detay
                        </button>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlySalesData}>
                                <defs>
                                    <linearGradient id="colorGelir" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorKar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1E293B',
                                        border: '1px solid #475569',
                                        borderRadius: '8px',
                                        color: '#F1F5F9'
                                    }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Area type="monotone" dataKey="gelir" stroke="#6366F1" fillOpacity={1} fill="url(#colorGelir)" name="Gelir" />
                                <Area type="monotone" dataKey="kar" stroke="#22C55E" fillOpacity={1} fill="url(#colorKar)" name="Kar" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Channel Distribution */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Satış Kanalları</h3>
                        <button className="btn btn-ghost btn-sm">
                            <BarChart3 size={16} />
                            Rapor
                        </button>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={channelSalesData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {channelSalesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#1E293B',
                                        border: '1px solid #475569',
                                        borderRadius: '8px',
                                        color: '#F1F5F9'
                                    }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Legend
                                    formatter={(value) => <span style={{ color: '#94A3B8', fontSize: '12px' }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-3">
                {/* Top Products */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">En Çok Satan Ürünler</h3>
                        <button className="btn btn-ghost btn-sm">
                            Tümü <ArrowRight size={14} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {topProducts.map((product, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: 'var(--dark-surface-2)',
                                    borderRadius: 'var(--radius)'
                                }}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: 'var(--radius)',
                                    background: 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 600,
                                    fontSize: '0.875rem'
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500, color: 'var(--gray-200)' }}>{product.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{product.quantity} adet satıldı</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--secondary-400)' }}>{formatCurrency(product.revenue)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h3 className="card-title">Son Siparişler</h3>
                        <button className="btn btn-ghost btn-sm">
                            Tümü <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="table-container" style={{ border: 'none' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Sipariş No</th>
                                    <th>Müşteri</th>
                                    <th>Kanal</th>
                                    <th>Durum</th>
                                    <th>Tutar</th>
                                    <th>Tarih</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td style={{ fontWeight: 500, color: 'var(--primary-400)' }}>{order.orderNumber}</td>
                                        <td>{order.customerName}</td>
                                        <td>
                                            <span className={`badge channel-${order.salesChannel}`}>
                                                {getChannelName(order.salesChannel)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getOrderStatusColor(order.status)}`}>
                                                {getOrderStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{formatCurrency(order.totalAmount)}</td>
                                        <td style={{ color: 'var(--gray-500)' }}>{formatDate(order.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    iconBg: string;
    value: string;
    label: string;
    trend: number | null;
    trendLabel?: string;
    subValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, iconBg, value, label, trend, trendLabel, subValue }) => (
    <div className="stat-card">
        <div className="icon" style={{ background: iconBg, color: 'white' }}>
            {icon}
        </div>
        <div className="value">{value}</div>
        <div className="label">{label}</div>
        {trend !== null && (
            <div className={`trend ${trend >= 0 ? 'up' : 'down'}`}>
                {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(trend).toFixed(1)}%</span>
                {trendLabel && <span style={{ color: 'var(--gray-500)' }}>{trendLabel}</span>}
            </div>
        )}
        {subValue && (
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                {subValue}
            </div>
        )}
    </div>
);

export default Dashboard;
