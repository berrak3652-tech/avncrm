import React, { useState, useMemo } from 'react';
import {
    Search,
    Plus,
    Filter,
    Download,
    Eye,
    Truck,
    Clock,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Calendar,
    MoreVertical,
    Package,
    DollarSign
} from 'lucide-react';
import {
    formatCurrency,
    formatDate,
    formatDateTime,
    getOrderStatusText,
    getOrderStatusColor,
    getChannelName,
    searchFilter
} from '../utils/helpers';
import { SALES_CHANNELS } from '../data/excelData';

interface OrdersPageProps {
    orders: any[];
    onUpdateOrder?: (order: any) => void;
    onSyncSiteOrders?: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ orders, onUpdateOrder, onSyncSiteOrders }) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedChannel, setSelectedChannel] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const itemsPerPage = 15;

    const stats = useMemo(() => ({
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        totalProfit: orders.reduce((sum, o) => sum + o.profit, 0)
    }), [orders]);

    const filteredOrders = useMemo(() => {
        let result = orders;

        if (selectedStatus !== 'all') {
            result = result.filter(o => o.status === selectedStatus);
        }

        if (selectedChannel !== 'all') {
            result = result.filter(o => o.salesChannel === selectedChannel);
        }

        if (searchQuery) {
            result = searchFilter(result, searchQuery, ['orderNumber', 'customerName']);
        }

        return result;
    }, [orders, selectedStatus, selectedChannel, searchQuery]);

    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(start, start + itemsPerPage);
    }, [filteredOrders, currentPage]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const updateOrderStatus = (order: any, newStatus: string) => {
        if (onUpdateOrder) {
            onUpdateOrder({ ...order, status: newStatus, updatedAt: new Date().toISOString() });
        }
    };

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-4 mb-6">
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon" style={{ background: 'linear-gradient(135deg, var(--warning), #D97706)', color: 'white' }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="value" style={{ fontSize: '1.5rem' }}>{stats.pending}</div>
                            <div className="label">Bekleyen</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', color: 'white' }}>
                            <Package size={24} />
                        </div>
                        <div>
                            <div className="value" style={{ fontSize: '1.5rem' }}>{stats.preparing}</div>
                            <div className="label">Hazırlanıyor</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon" style={{ background: 'linear-gradient(135deg, var(--info), #2563EB)', color: 'white' }}>
                            <Truck size={24} />
                        </div>
                        <div>
                            <div className="value" style={{ fontSize: '1.5rem' }}>{stats.shipped}</div>
                            <div className="label">Kargoda</div>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon" style={{ background: 'linear-gradient(135deg, var(--secondary-500), var(--secondary-600))', color: 'white' }}>
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <div className="value" style={{ fontSize: '1.5rem' }}>{stats.delivered}</div>
                            <div className="label">Teslim Edildi</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div className="search-box" style={{ maxWidth: '300px' }}>
                            <Search className="icon" size={18} />
                            <input
                                type="text"
                                placeholder="Sipariş no veya müşteri ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <select
                            className="form-select"
                            style={{ width: 'auto', minWidth: '150px' }}
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="pending">Beklemede</option>
                            <option value="confirmed">Onaylandı</option>
                            <option value="preparing">Hazırlanıyor</option>
                            <option value="shipped">Kargoda</option>
                            <option value="delivered">Teslim Edildi</option>
                            <option value="cancelled">İptal</option>
                        </select>

                        <select
                            className="form-select"
                            style={{ width: 'auto', minWidth: '150px' }}
                            value={selectedChannel}
                            onChange={(e) => setSelectedChannel(e.target.value)}
                        >
                            <option value="all">Tüm Kanallar</option>
                            {SALES_CHANNELS.map(channel => (
                                <option key={channel.id} value={channel.id}>{channel.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button className="btn btn-secondary">
                            <Calendar size={16} />
                            Tarih Aralığı
                        </button>
                        <button className="btn btn-secondary">
                            <Download size={16} />
                            Excel
                        </button>
                        <button className="btn btn-secondary" onClick={onSyncSiteOrders}>
                            <DollarSign size={16} />
                            Web Siteden Çek
                        </button>
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            <Plus size={16} />
                            Manuel Sipariş
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Sipariş No</th>
                                <th>Müşteri</th>
                                <th>Ürünler</th>
                                <th>Kanal</th>
                                <th>Tutar</th>
                                <th>Kar</th>
                                <th>Durum</th>
                                <th>Tarih</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.map(order => (
                                <tr key={order.id}>
                                    <td style={{ fontWeight: 600, color: 'var(--primary-400)' }}>
                                        {order.orderNumber}
                                    </td>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 500, color: 'var(--gray-200)' }}>{order.customerName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{order.shippingAddress.split(',')[2]}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            {order.products.slice(0, 2).map((p, i) => (
                                                <span key={i} style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                                    {p.productName} x{p.quantity}
                                                </span>
                                            ))}
                                            {order.products.length > 2 && (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--primary-400)' }}>
                                                    +{order.products.length - 2} ürün daha
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge channel-${order.salesChannel}`}>
                                            {getChannelName(order.salesChannel)}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{formatCurrency(order.totalAmount)}</td>
                                    <td className={order.profit >= 0 ? 'price-positive' : 'price-negative'} style={{ fontWeight: 500 }}>
                                        {formatCurrency(order.profit)}
                                    </td>
                                    <td>
                                        <span className={`badge ${getOrderStatusColor(order.status)}`}>
                                            {getOrderStatusText(order.status)}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button
                                                className="btn btn-ghost btn-icon"
                                                onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            {order.status === 'pending' && (
                                                <button
                                                    className="btn btn-ghost btn-icon"
                                                    style={{ color: 'var(--secondary-400)' }}
                                                    onClick={() => updateOrderStatus(order, 'confirmed')}
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            {order.status === 'confirmed' && (
                                                <button
                                                    className="btn btn-ghost btn-icon"
                                                    style={{ color: 'var(--primary-400)' }}
                                                    onClick={() => updateOrderStatus(order, 'preparing')}
                                                >
                                                    <Package size={16} />
                                                </button>
                                            )}
                                            {order.status === 'preparing' && (
                                                <button
                                                    className="btn btn-ghost btn-icon"
                                                    style={{ color: 'var(--info)' }}
                                                    onClick={() => updateOrderStatus(order, 'shipped')}
                                                >
                                                    <Truck size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderTop: '1px solid var(--dark-border)'
                }}>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                        {filteredOrders.length} siparişten {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredOrders.length)} gösteriliyor
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {showModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h3 className="modal-title">{selectedOrder.orderNumber}</h3>
                                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                                    {formatDateTime(selectedOrder.createdAt)}
                                </div>
                            </div>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="grid grid-3" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="card" style={{ padding: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>Müşteri</div>
                                    <div style={{ fontWeight: 500, color: 'var(--gray-200)' }}>{selectedOrder.customerName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                                        {selectedOrder.shippingAddress}
                                    </div>
                                </div>
                                <div className="card" style={{ padding: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>Satış Kanalı</div>
                                    <span className={`badge channel-${selectedOrder.salesChannel}`}>
                                        {getChannelName(selectedOrder.salesChannel)}
                                    </span>
                                </div>
                                <div className="card" style={{ padding: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>Sipariş Durumu</div>
                                    <span className={`badge ${getOrderStatusColor(selectedOrder.status)}`}>
                                        {getOrderStatusText(selectedOrder.status)}
                                    </span>
                                </div>
                            </div>

                            <h4 style={{ marginBottom: '1rem', color: 'var(--gray-300)' }}>Ürünler</h4>
                            <div className="table-container" style={{ marginBottom: '1.5rem' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Ürün</th>
                                            <th>Adet</th>
                                            <th>Birim Fiyat</th>
                                            <th>İndirim</th>
                                            <th>Toplam</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.products.map((product, index) => (
                                            <tr key={index}>
                                                <td style={{ fontWeight: 500, color: 'var(--gray-200)' }}>{product.productName}</td>
                                                <td>{product.quantity}</td>
                                                <td>{formatCurrency(product.unitPrice)}</td>
                                                <td>{product.discount > 0 ? `%${product.discount}` : '-'}</td>
                                                <td style={{ fontWeight: 600 }}>{formatCurrency(product.totalPrice)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                                <div className="card" style={{ padding: '1rem' }}>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--gray-300)' }}>Maliyet Özeti</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--gray-500)' }}>Ürün Maliyeti</span>
                                            <span style={{ color: 'var(--gray-300)' }}>{formatCurrency(selectedOrder.totalCost)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--gray-500)' }}>Kargo</span>
                                            <span style={{ color: 'var(--gray-300)' }}>{formatCurrency(selectedOrder.cargoCost)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--dark-border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--gray-300)' }}>Net Kar</span>
                                            <span className={selectedOrder.profit >= 0 ? 'price-positive' : 'price-negative'} style={{ fontWeight: 600 }}>
                                                {formatCurrency(selectedOrder.profit)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card" style={{ padding: '1rem' }}>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--gray-300)' }}>Sipariş Özeti</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--gray-500)' }}>Ara Toplam</span>
                                            <span style={{ color: 'var(--gray-300)' }}>{formatCurrency(selectedOrder.totalAmount)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--gray-500)' }}>Kargo</span>
                                            <span style={{ color: 'var(--gray-300)' }}>Ücretsiz</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--dark-border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--gray-300)' }}>Genel Toplam</span>
                                            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-400)' }}>
                                                {formatCurrency(selectedOrder.totalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Kapat</button>
                            <button className="btn btn-primary">
                                <Truck size={16} />
                                Kargoya Ver
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Add Order Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Manuel Sipariş Oluştur</h3>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Müşteri Seçin</label>
                                <input type="text" className="form-input" placeholder="Müşteri adı ara..." />
                            </div>
                            <div className="grid grid-2" style={{ gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Satış Kanalı</label>
                                    <select className="form-select">
                                        {SALES_CHANNELS.map(channel => (
                                            <option key={channel.id} value={channel.id}>{channel.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ödeme Yöntemi</label>
                                    <select className="form-select">
                                        <option value="credit_card">Kredi Kartı</option>
                                        <option value="bank_transfer">Havale/EFT</option>
                                        <option value="cash_on_delivery">Kapıda Ödeme</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Ürün Ekleyin</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input type="text" className="form-input" placeholder="Ürün ara..." />
                                    <button className="btn btn-secondary">Ekle</button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Teslimat Adresi</label>
                                <textarea className="form-textarea" placeholder="Adres detayları..."></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>İptal</button>
                            <button className="btn btn-primary" onClick={() => {
                                alert('Sipariş başarıyla oluşturuldu (Simülasyon)');
                                setShowAddModal(false);
                            }}>
                                <Plus size={16} />
                                Siparişi Oluştur
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
