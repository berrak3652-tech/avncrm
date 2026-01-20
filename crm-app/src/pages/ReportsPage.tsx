import React, { useMemo, useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Calendar,
    Download,
    Filter
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
    Legend,
    LineChart,
    Line
} from 'recharts';
import type { Order } from '../types';
import { formatCurrency, getChannelName } from '../utils/helpers';
import { SALES_CHANNELS } from '../data/excelData';

interface ReportsPageProps {
    orders: Order[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ orders }) => {
    const [period, setPeriod] = useState('month');

    const stats = useMemo(() => ({
        totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        totalProfit: orders.reduce((sum, o) => sum + o.profit, 0),
        totalOrders: orders.length,
        avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length : 0
    }), [orders]);

    const monthlyData = useMemo(() => {
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        const now = new Date();

        return Array.from({ length: 6 }, (_, i) => {
            const monthIndex = (now.getMonth() - 5 + i + 12) % 12;
            const monthOrders = orders.filter(o => new Date(o.createdAt).getMonth() === monthIndex);
            return {
                name: months[monthIndex],
                gelir: monthOrders.reduce((sum, o) => sum + o.totalAmount, 0),
                kar: monthOrders.reduce((sum, o) => sum + o.profit, 0),
                siparis: monthOrders.length
            };
        });
    }, [orders]);

    const channelData = useMemo(() => {
        const data: Record<string, { revenue: number; profit: number; orders: number }> = {};

        orders.forEach(order => {
            if (!data[order.salesChannel]) {
                data[order.salesChannel] = { revenue: 0, profit: 0, orders: 0 };
            }
            data[order.salesChannel].revenue += order.totalAmount;
            data[order.salesChannel].profit += order.profit;
            data[order.salesChannel].orders += 1;
        });

        return Object.entries(data).map(([channel, values]) => ({
            name: getChannelName(channel as any),
            ...values,
            color: SALES_CHANNELS.find(c => c.id === channel)?.color || '#6366F1'
        })).sort((a, b) => b.revenue - a.revenue);
    }, [orders]);

    const profitMarginData = useMemo(() => {
        return channelData.map(ch => ({
            name: ch.name,
            margin: ch.revenue > 0 ? (ch.profit / ch.revenue) * 100 : 0,
            color: ch.color
        }));
    }, [channelData]);

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.25rem' }}>Satış Raporları</h2>
                    <p style={{ color: 'var(--gray-500)' }}>Detaylı satış ve kar analizleri</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                        className="form-select"
                        style={{ width: 'auto' }}
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <option value="week">Bu Hafta</option>
                        <option value="month">Bu Ay</option>
                        <option value="quarter">Bu Çeyrek</option>
                        <option value="year">Bu Yıl</option>
                    </select>
                    <button className="btn btn-secondary">
                        <Calendar size={16} />
                        Tarih Seç
                    </button>
                    <button className="btn btn-primary">
                        <Download size={16} />
                        Rapor İndir
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-4 mb-6">
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', color: 'white' }}>
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <div className="value" style={{ fontSize: '1.5rem' }}>{formatCurrency(stats.totalRevenue)}</div>
                            <div className="label">Toplam Gelir</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon" style={{ background: 'linear-gradient(135deg, var(--secondary-500), var(--secondary-600))', color: 'white' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <div className="value" style={{ fontSize: '1.5rem' }}>{formatCurrency(stats.totalProfit)}</div>
                            <div className="label">Toplam Kar</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon" style={{ background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))', color: 'white' }}>
                            <ShoppingCart size={24} />
                        </div>
                        <div>
                            <div className="value" style={{ fontSize: '1.5rem' }}>{stats.totalOrders}</div>
                            <div className="label">Toplam Sipariş</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white' }}>
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <div className="value" style={{ fontSize: '1.5rem' }}>{formatCurrency(stats.avgOrderValue)}</div>
                            <div className="label">Ort. Sipariş Değeri</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-2 mb-6">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Aylık Gelir & Kar</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorGelir2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorKar2" x1="0" y1="0" x2="0" y2="1">
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
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Area type="monotone" dataKey="gelir" stroke="#6366F1" fillOpacity={1} fill="url(#colorGelir2)" name="Gelir" />
                                <Area type="monotone" dataKey="kar" stroke="#22C55E" fillOpacity={1} fill="url(#colorKar2)" name="Kar" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Sipariş Sayısı Trendi</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                                <YAxis stroke="#94A3B8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1E293B',
                                        border: '1px solid #475569',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="siparis" fill="#6366F1" radius={[4, 4, 0, 0]} name="Sipariş" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-2 mb-6">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Kanal Bazlı Gelir</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={channelData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`} />
                                <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={12} width={100} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1E293B',
                                        border: '1px solid #475569',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Bar dataKey="revenue" name="Gelir" radius={[0, 4, 4, 0]}>
                                    {channelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Kanal Kar Marjı (%)</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={profitMarginData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `%${v.toFixed(0)}`} />
                                <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={12} width={100} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1E293B',
                                        border: '1px solid #475569',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number) => `%${value.toFixed(2)}`}
                                />
                                <Bar dataKey="margin" name="Kar Marjı" radius={[0, 4, 4, 0]}>
                                    {profitMarginData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.margin > 0 ? '#22C55E' : '#EF4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Channel Details Table */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Kanal Detay Raporu</h3>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Satış Kanalı</th>
                                <th>Sipariş Sayısı</th>
                                <th>Toplam Gelir</th>
                                <th>Toplam Kar</th>
                                <th>Kar Marjı</th>
                                <th>Ort. Sipariş</th>
                            </tr>
                        </thead>
                        <tbody>
                            {channelData.map((channel, index) => (
                                <tr key={index}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                background: channel.color
                                            }} />
                                            <span style={{ fontWeight: 500, color: 'var(--gray-200)' }}>{channel.name}</span>
                                        </div>
                                    </td>
                                    <td>{channel.orders}</td>
                                    <td style={{ fontWeight: 500 }}>{formatCurrency(channel.revenue)}</td>
                                    <td className={channel.profit >= 0 ? 'price-positive' : 'price-negative'} style={{ fontWeight: 500 }}>
                                        {formatCurrency(channel.profit)}
                                    </td>
                                    <td className={channel.profit >= 0 ? 'price-positive' : 'price-negative'}>
                                        %{((channel.profit / channel.revenue) * 100).toFixed(1)}
                                    </td>
                                    <td>{formatCurrency(channel.revenue / channel.orders)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
