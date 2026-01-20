import React, { useMemo } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    ExternalLink,
    BarChart3,
    Eye
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import type { Order } from '../types';
import { formatCurrency, getChannelName } from '../utils/helpers';
import { SALES_CHANNELS } from '../data/excelData';

interface ChannelsPageProps {
    orders: Order[];
}

export const ChannelsPage: React.FC<ChannelsPageProps> = ({ orders }) => {
    const channelStats = useMemo(() => {
        const stats: Record<string, {
            orders: number;
            revenue: number;
            profit: number;
            avgOrder: number;
            commission: number;
        }> = {};

        orders.forEach(order => {
            if (!stats[order.salesChannel]) {
                stats[order.salesChannel] = { orders: 0, revenue: 0, profit: 0, avgOrder: 0, commission: 0 };
            }
            stats[order.salesChannel].orders += 1;
            stats[order.salesChannel].revenue += order.totalAmount;
            stats[order.salesChannel].profit += order.profit;
        });

        Object.keys(stats).forEach(channel => {
            stats[channel].avgOrder = stats[channel].revenue / stats[channel].orders;
            const channelInfo = SALES_CHANNELS.find(c => c.id === channel);
            stats[channel].commission = channelInfo?.commission || 0;
        });

        return stats;
    }, [orders]);

    const pieData = useMemo(() => {
        return Object.entries(channelStats).map(([channel, data]) => ({
            name: getChannelName(channel as any),
            value: data.revenue,
            color: SALES_CHANNELS.find(c => c.id === channel)?.color || '#6366F1'
        })).sort((a, b) => b.value - a.value);
    }, [channelStats]);

    const barData = useMemo(() => {
        return Object.entries(channelStats).map(([channel, data]) => ({
            name: getChannelName(channel as any),
            orders: data.orders,
            revenue: data.revenue,
            profit: data.profit,
            color: SALES_CHANNELS.find(c => c.id === channel)?.color || '#6366F1'
        })).sort((a, b) => b.revenue - a.revenue);
    }, [channelStats]);

    const totalRevenue = Object.values(channelStats).reduce((sum, s) => sum + s.revenue, 0);
    const totalProfit = Object.values(channelStats).reduce((sum, s) => sum + s.profit, 0);
    const totalOrders = Object.values(channelStats).reduce((sum, s) => sum + s.orders, 0);

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ marginBottom: '0.25rem' }}>Satış Kanalları</h2>
                <p style={{ color: 'var(--gray-500)' }}>Kanal bazlı performans analizi</p>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-4 mb-6">
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', color: 'white' }}>
                        <BarChart3 size={24} />
                    </div>
                    <div className="value">{Object.keys(channelStats).length}</div>
                    <div className="label">Aktif Kanal</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--secondary-500), var(--secondary-600))', color: 'white' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className="value">{formatCurrency(totalRevenue)}</div>
                    <div className="label">Toplam Gelir</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))', color: 'white' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="value">{formatCurrency(totalProfit)}</div>
                    <div className="label">Toplam Kar</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white' }}>
                        <ShoppingCart size={24} />
                    </div>
                    <div className="value">{totalOrders}</div>
                    <div className="label">Toplam Sipariş</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-2 mb-6">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Gelir Dağılımı</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#1E293B',
                                        border: '1px solid #475569',
                                        borderRadius: '8px'
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

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Kar Karşılaştırması</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`} />
                                <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} width={90} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1E293B',
                                        border: '1px solid #475569',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Bar dataKey="profit" name="Kar" radius={[0, 4, 4, 0]}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#22C55E' : '#EF4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Channel Cards */}
            <div className="grid grid-3">
                {SALES_CHANNELS.map(channel => {
                    const stats = channelStats[channel.id];
                    if (!stats) return null;

                    const profitMargin = stats.revenue > 0 ? (stats.profit / stats.revenue) * 100 : 0;
                    const share = totalRevenue > 0 ? (stats.revenue / totalRevenue) * 100 : 0;

                    return (
                        <div key={channel.id} className="card" style={{ borderTop: `3px solid ${channel.color}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h4 style={{ color: 'var(--gray-200)', marginBottom: '0.25rem' }}>{channel.name}</h4>
                                    <span className="badge badge-primary">%{channel.commission} Komisyon</span>
                                </div>
                                <button className="btn btn-ghost btn-icon">
                                    <ExternalLink size={16} />
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Sipariş</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--gray-200)' }}>{stats.orders}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Gelir Payı</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: channel.color }}>%{share.toFixed(1)}</div>
                                </div>
                            </div>

                            <div style={{
                                padding: '1rem',
                                background: 'var(--dark-surface-2)',
                                borderRadius: 'var(--radius)',
                                marginBottom: '1rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--gray-500)' }}>Gelir</span>
                                    <span style={{ fontWeight: 500, color: 'var(--gray-200)' }}>{formatCurrency(stats.revenue)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--gray-500)' }}>Kar</span>
                                    <span className={stats.profit >= 0 ? 'price-positive' : 'price-negative'} style={{ fontWeight: 500 }}>
                                        {formatCurrency(stats.profit)}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--gray-500)' }}>Kar Marjı</span>
                                    <span className={profitMargin >= 0 ? 'price-positive' : 'price-negative'} style={{ fontWeight: 500 }}>
                                        %{profitMargin.toFixed(1)}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                    Ort. Sipariş: <span style={{ fontWeight: 500, color: 'var(--gray-300)' }}>{formatCurrency(stats.avgOrder)}</span>
                                </div>
                                <button className="btn btn-ghost btn-sm">
                                    <Eye size={14} />
                                    Detay
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChannelsPage;
