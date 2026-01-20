import React, { useState, useMemo } from 'react';
import {
    Search,
    Plus,
    Download,
    Edit2,
    Trash2,
    Eye,
    Users,
    UserPlus,
    Star,
    Mail,
    Phone,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Building,
    User
} from 'lucide-react';
import type { Customer } from '../types';
import { formatCurrency, formatDate, searchFilter } from '../utils/helpers';

interface CustomersPageProps {
    customers: Customer[];
    onUpdateCustomer?: (customer: Customer) => void;
    onDeleteCustomer?: (id: string) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ customers, onUpdateCustomer, onDeleteCustomer }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const itemsPerPage = 12;

    const stats = useMemo(() => ({
        total: customers.length,
        individual: customers.filter(c => c.type === 'individual').length,
        corporate: customers.filter(c => c.type === 'corporate').length,
        vip: customers.filter(c => c.status === 'vip').length,
        totalSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0)
    }), [customers]);

    const filteredCustomers = useMemo(() => {
        let result = customers;

        if (selectedType !== 'all') {
            result = result.filter(c => c.type === selectedType);
        }

        if (selectedStatus !== 'all') {
            result = result.filter(c => c.status === selectedStatus);
        }

        if (searchQuery) {
            result = searchFilter(result, searchQuery, ['name', 'email', 'phone', 'city', 'companyName']);
        }

        return result;
    }, [customers, selectedType, selectedStatus, searchQuery]);

    const paginatedCustomers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredCustomers.slice(start, start + itemsPerPage);
    }, [filteredCustomers, currentPage]);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-4 mb-6">
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', color: 'white' }}>
                        <Users size={24} />
                    </div>
                    <div className="value">{stats.total}</div>
                    <div className="label">Toplam Müşteri</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--secondary-500), var(--secondary-600))', color: 'white' }}>
                        <User size={24} />
                    </div>
                    <div className="value">{stats.individual}</div>
                    <div className="label">Bireysel</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))', color: 'white' }}>
                        <Building size={24} />
                    </div>
                    <div className="value">{stats.corporate}</div>
                    <div className="label">Kurumsal</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white' }}>
                        <Star size={24} />
                    </div>
                    <div className="value">{stats.vip}</div>
                    <div className="label">VIP Müşteri</div>
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
                                placeholder="Müşteri ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <select
                            className="form-select"
                            style={{ width: 'auto', minWidth: '150px' }}
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="all">Tüm Tipler</option>
                            <option value="individual">Bireysel</option>
                            <option value="corporate">Kurumsal</option>
                        </select>

                        <select
                            className="form-select"
                            style={{ width: 'auto', minWidth: '150px' }}
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Pasif</option>
                            <option value="vip">VIP</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button className="btn btn-secondary">
                            <Download size={16} />
                            Excel
                        </button>
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            <UserPlus size={16} />
                            Yeni Müşteri
                        </button>
                    </div>
                </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-3 mb-6">
                {paginatedCustomers.map(customer => (
                    <CustomerCard
                        key={customer.id}
                        customer={customer}
                        onView={() => { setSelectedCustomer(customer); setShowModal(true); }}
                        onEdit={() => { }}
                        onDelete={() => { }}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                    {filteredCustomers.length} müşteriden {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredCustomers.length)} gösteriliyor
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

            {/* Customer Detail Modal */}
            {showModal && selectedCustomer && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                    color: 'white'
                                }}>
                                    {selectedCustomer.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="modal-title">{selectedCustomer.name}</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <span className={`badge ${selectedCustomer.type === 'corporate' ? 'badge-primary' : 'badge-info'}`}>
                                            {selectedCustomer.type === 'corporate' ? 'Kurumsal' : 'Bireysel'}
                                        </span>
                                        {selectedCustomer.status === 'vip' && (
                                            <span className="badge badge-warning">
                                                <Star size={12} style={{ marginRight: '0.25rem' }} />
                                                VIP
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="grid grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--gray-300)' }}>İletişim Bilgileri</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Mail size={16} style={{ color: 'var(--gray-500)' }} />
                                            <span style={{ color: 'var(--gray-300)' }}>{selectedCustomer.email}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Phone size={16} style={{ color: 'var(--gray-500)' }} />
                                            <span style={{ color: 'var(--gray-300)' }}>{selectedCustomer.phone}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <MapPin size={16} style={{ color: 'var(--gray-500)' }} />
                                            <span style={{ color: 'var(--gray-300)' }}>{selectedCustomer.address}, {selectedCustomer.district}, {selectedCustomer.city}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--gray-300)' }}>Sipariş Bilgileri</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--gray-500)' }}>Toplam Sipariş</span>
                                            <span style={{ fontWeight: 600, color: 'var(--gray-200)' }}>{selectedCustomer.totalOrders}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--gray-500)' }}>Toplam Harcama</span>
                                            <span style={{ fontWeight: 600, color: 'var(--secondary-400)' }}>{formatCurrency(selectedCustomer.totalSpent)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--gray-500)' }}>Kayıt Tarihi</span>
                                            <span style={{ color: 'var(--gray-300)' }}>{formatDate(selectedCustomer.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedCustomer.type === 'corporate' && selectedCustomer.companyName && (
                                <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                                    <h4 style={{ marginBottom: '0.75rem', color: 'var(--gray-300)' }}>Şirket Bilgileri</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--gray-500)' }}>Şirket Adı</span>
                                        <span style={{ color: 'var(--gray-200)' }}>{selectedCustomer.companyName}</span>
                                    </div>
                                    {selectedCustomer.taxNumber && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                            <span style={{ color: 'var(--gray-500)' }}>Vergi No</span>
                                            <span style={{ color: 'var(--gray-200)' }}>{selectedCustomer.taxNumber}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedCustomer.notes && (
                                <div className="card" style={{ padding: '1rem' }}>
                                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--gray-300)' }}>Notlar</h4>
                                    <p style={{ color: 'var(--gray-400)' }}>{selectedCustomer.notes}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Kapat</button>
                            <button className="btn btn-primary">
                                <Edit2 size={16} />
                                Düzenle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Customer Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Yeni Müşteri Ekle</h3>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Müşteri Tipi</label>
                                <select className="form-select">
                                    <option value="individual">Bireysel</option>
                                    <option value="corporate">Kurumsal</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Ad Soyad</label>
                                <input type="text" className="form-input" placeholder="Ad Soyad" />
                            </div>
                            <div className="grid grid-2" style={{ gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-input" placeholder="Email" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Telefon</label>
                                    <input type="tel" className="form-input" placeholder="05XX XXX XX XX" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Adres</label>
                                <textarea className="form-textarea" placeholder="Adres"></textarea>
                            </div>
                            <div className="grid grid-2" style={{ gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">İl</label>
                                    <input type="text" className="form-input" placeholder="İl" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">İlçe</label>
                                    <input type="text" className="form-input" placeholder="İlçe" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>İptal</button>
                            <button className="btn btn-primary">
                                <UserPlus size={16} />
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface CustomerCardProps {
    customer: Customer;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onView, onEdit, onDelete }) => (
    <div className="card" style={{ cursor: 'pointer' }} onClick={onView}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-full)',
                background: customer.status === 'vip'
                    ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                    : 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'white',
                flexShrink: 0
            }}>
                {customer.name.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--gray-200)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {customer.name}
                    {customer.status === 'vip' && <Star size={14} style={{ color: 'var(--warning)' }} />}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                    {customer.type === 'corporate' ? customer.companyName : customer.email}
                </div>
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <Phone size={14} style={{ color: 'var(--gray-500)' }} />
                <span style={{ color: 'var(--gray-400)' }}>{customer.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <MapPin size={14} style={{ color: 'var(--gray-500)' }} />
                <span style={{ color: 'var(--gray-400)' }}>{customer.city}</span>
            </div>
        </div>

        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem 0 0',
            borderTop: '1px solid var(--dark-border)'
        }}>
            <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Sipariş</div>
                <div style={{ fontWeight: 600, color: 'var(--gray-200)' }}>{customer.totalOrders}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Harcama</div>
                <div style={{ fontWeight: 600, color: 'var(--secondary-400)' }}>{formatCurrency(customer.totalSpent)}</div>
            </div>
        </div>
    </div>
);

export default CustomersPage;
