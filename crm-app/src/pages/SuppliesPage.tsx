import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    Download,
    Eye,
    Package,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    Tag,
    X,
    Truck
} from 'lucide-react';
import { formatCurrency, searchFilter } from '../utils/helpers';
import type { SupplyProduct } from '../types';
import { CARGO_PRICES_DATA } from '../data/excelData';

interface SuppliesPageProps {
    supplies: SupplyProduct[];
}

export const SuppliesPage: React.FC<SuppliesPageProps> = ({ supplies }) => {
    const [localSupplies, setLocalSupplies] = useState<SupplyProduct[]>(supplies);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tümü');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSupply, setSelectedSupply] = useState<SupplyProduct | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Form state for editing
    const [editForm, setEditForm] = useState({
        cargoCost: 0,
        returnCost: 0,
        profitMargin: 25,
        desi: 0,
        cargoCompany: 'Horoz Lojistik'
    });

    const cargoCompanies = useMemo(() => {
        return Array.from(new Set(CARGO_PRICES_DATA.map(c => c.company)));
    }, []);

    const findCargoPrice = (company: string, desi: number) => {
        if (desi <= 0) return 0;
        const prices = CARGO_PRICES_DATA.filter(p => p.company === company).sort((a, b) => a.desi - b.desi);
        const match = prices.find(p => p.desi >= desi);
        return match ? match.price : (prices.length > 0 ? prices[prices.length - 1].price : 0);
    };

    const itemsPerPage = 12;

    const categories = useMemo(() => {
        const cats = Array.from(new Set(localSupplies.map(s => (s.category || 'Genel').split('>')[0].trim())));
        return ['Tümü', ...cats];
    }, [localSupplies]);

    const filteredSupplies = useMemo(() => {
        let result = localSupplies;

        if (selectedCategory !== 'Tümü') {
            result = result.filter(s => s.category?.startsWith(selectedCategory));
        }

        if (searchQuery) {
            result = searchFilter(result, searchQuery, ['name', 'brand', 'category', 'code']);
        }

        return result;
    }, [localSupplies, selectedCategory, searchQuery]);

    const calculateSalePrice = (s: SupplyProduct) => {
        const base = s.price || 0;
        const cargo = s.desi ? findCargoPrice(s.cargoCompany || 'Horoz Lojistik', s.desi) : (s.cargoCost || 0);
        const margin = s.profitMargin !== undefined ? s.profitMargin : 25;
        const K = 1 + margin / 100;

        // Formula: SalePrice = (Base + Cargo + 0.05 * SalePrice) * K
        // SalePrice = (Base + Cargo) * K + 0.05 * SalePrice * K
        // SalePrice * (1 - 0.05 * K) = (Base + Cargo) * K
        // SalePrice = ((Base + Cargo) * K) / (1 - 0.05 * K)

        const price = ((base + cargo) * K) / (1 - 0.05 * K);
        return price;
    };

    const handleUpdatePricing = () => {
        if (!selectedSupply) return;
        setLocalSupplies(prev => prev.map(s =>
            s.id === selectedSupply.id
                ? { ...s, ...editForm }
                : s
        ));
        setShowEditModal(false);
        alert('Fiyatlandırma başarıyla güncellendi.');
    };

    const paginatedSupplies = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredSupplies.slice(start, start + itemsPerPage);
    }, [filteredSupplies, currentPage]);

    const totalPages = Math.ceil(filteredSupplies.length / itemsPerPage);

    const stats = useMemo(() => ({
        total: localSupplies.length,
        brands: new Set(localSupplies.map(s => s.brand)).size,
        totalStock: localSupplies.reduce((sum, s) => sum + s.stock, 0),
        avgPrice: localSupplies.reduce((sum, s) => sum + calculateSalePrice(s), 0) / localSupplies.length
    }), [localSupplies]);

    return (
        <div className="animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-4 mb-6">
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', color: 'white' }}>
                        <Package size={24} />
                    </div>
                    <div className="value">{stats.total}</div>
                    <div className="label">Toplam Tedarik Ürünü</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--secondary-500), var(--secondary-600))', color: 'white' }}>
                        <Tag size={24} />
                    </div>
                    <div className="value">{stats.brands}</div>
                    <div className="label">Farklı Marka</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))', color: 'white' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="value">{stats.totalStock.toLocaleString()}</div>
                    <div className="label">Toplam Stok (Adet)</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="value">{formatCurrency(stats.avgPrice || 0)}</div>
                    <div className="label">Ortalama Satış Fiyatı</div>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div className="search-box" style={{ maxWidth: '400px' }}>
                            <Search className="icon" size={18} />
                            <input
                                type="text"
                                placeholder="Ürün adı, marka veya kod ile ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <select
                            className="form-select"
                            style={{ width: 'auto', minWidth: '200px' }}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <button className="btn btn-secondary">
                        <Download size={16} />
                        Excel İndir
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-4" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                {paginatedSupplies.map(supply => (
                    <div key={supply.id} className="card product-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ height: '200px', backgroundColor: 'var(--dark-surface-2)', position: 'relative' }}>
                            {supply.images && supply.images[0] ? (
                                <img
                                    src={supply.images[0]}
                                    alt={supply.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)' }}>
                                    <Package size={48} />
                                </div>
                            )}
                            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                                <span className="badge badge-primary" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(30, 58, 95, 0.8)' }}>
                                    {supply.brand}
                                </span>
                                <span className="badge badge-success" style={{ backdropFilter: 'blur(4px)', fontSize: '0.7rem' }}>
                                    %{supply.profitMargin || 25} Kar
                                </span>
                            </div>
                        </div>
                        <div style={{ padding: '1.25rem' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>{supply.code}</div>
                            <h4 style={{
                                fontSize: '0.925rem',
                                fontWeight: 600,
                                marginBottom: '0.5rem',
                                color: 'var(--gray-200)',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {supply.name}
                            </h4>
                            <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'rgba(0,0,0,0.1)', borderRadius: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '4px' }}>
                                    <span>Tedarik: {formatCurrency(supply.price)}</span>
                                    <span>İade (%5): {formatCurrency(calculateSalePrice(supply) * 0.05)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                    <span>{supply.cargoCompany || 'Horoz'}: {supply.desi || 0} Desi</span>
                                    <span>Kargo: {formatCurrency(supply.desi ? findCargoPrice(supply.cargoCompany || 'Horoz Lojistik', supply.desi) : (supply.cargoCost || 0))}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>Satış Fiyatı</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-400)' }}>
                                        {formatCurrency(calculateSalePrice(supply))}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>Stok</div>
                                    <div style={{ fontWeight: 600, color: supply.stock > 0 ? 'var(--secondary-400)' : 'var(--error)' }}>
                                        {supply.stock} Adet
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    style={{ flex: 1, border: '1px solid var(--dark-border)' }}
                                    onClick={() => { setSelectedSupply(supply); setShowModal(true); }}
                                >
                                    Detay
                                </button>
                                <button
                                    className="btn btn-primary btn-sm"
                                    style={{ flex: 1 }}
                                    onClick={() => {
                                        setSelectedSupply(supply);
                                        setEditForm({
                                            cargoCost: supply.cargoCost || 0,
                                            returnCost: supply.returnCost || 0,
                                            profitMargin: supply.profitMargin !== undefined ? supply.profitMargin : 25,
                                            desi: supply.desi || 0,
                                            cargoCompany: supply.cargoCompany || 'Horoz Lojistik'
                                        });
                                        setShowEditModal(true);
                                    }}
                                >
                                    Fiyatlandır
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                    {filteredSupplies.length} üründen {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredSupplies.length)} gösteriliyor
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (currentPage > 3 && totalPages > 5) {
                            pageNum = currentPage - 3 + i + 1;
                        }
                        if (pageNum > totalPages) return null;
                        return (
                            <button
                                key={pageNum}
                                className={`btn btn-sm ${pageNum === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setCurrentPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Detail Modal */}
            {showModal && selectedSupply && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Ürün Detayı</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="grid grid-2" style={{ gap: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{
                                        aspectRatio: '1/1',
                                        backgroundColor: 'white',
                                        borderRadius: 'var(--radius-lg)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '2rem',
                                        border: '1px solid var(--dark-border)'
                                    }}>
                                        <img
                                            src={selectedSupply.images[0]}
                                            alt={selectedSupply.name}
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div className="grid grid-4" style={{ gap: '0.5rem' }}>
                                        {selectedSupply.images.slice(1).map((img, idx) => (
                                            <div key={idx} style={{
                                                aspectRatio: '1/1',
                                                backgroundColor: 'white',
                                                borderRadius: 'var(--radius)',
                                                padding: '0.5rem',
                                                border: '1px solid var(--dark-border)'
                                            }}>
                                                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="badge badge-primary mb-2">{selectedSupply.brand}</div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>{selectedSupply.name}</h2>
                                    <div style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{selectedSupply.category}</div>

                                    <div style={{
                                        padding: '1.5rem',
                                        backgroundColor: 'var(--dark-surface-2)',
                                        borderRadius: 'var(--radius-lg)',
                                        marginBottom: '1.5rem',
                                        border: '1px solid var(--dark-border)'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: 'var(--gray-500)' }}>Tedarik Fiyatı</span>
                                                <span style={{ fontWeight: 600 }}>{formatCurrency(selectedSupply.price)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: 'var(--gray-500)' }}>Kargo ({selectedSupply.cargoCompany || 'Horoz'} - {selectedSupply.desi || 0} Desi)</span>
                                                <span style={{ fontWeight: 600 }}>{formatCurrency(selectedSupply.desi ? findCargoPrice(selectedSupply.cargoCompany || 'Horoz Lojistik', selectedSupply.desi) : (selectedSupply.cargoCost || 0))}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: 'var(--gray-500)' }}>İade Gideri Payı (%5)</span>
                                                <span style={{ fontWeight: 600 }}>{formatCurrency(calculateSalePrice(selectedSupply) * 0.05)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: 'var(--gray-500)' }}>Net Kar (%{selectedSupply.profitMargin || 25})</span>
                                                <span style={{ fontWeight: 600, color: 'var(--success)' }}>
                                                    {formatCurrency(calculateSalePrice(selectedSupply) - selectedSupply.price - (selectedSupply.desi ? findCargoPrice(selectedSupply.cargoCompany || 'Horoz Lojistik', selectedSupply.desi) : (selectedSupply.cargoCost || 0)) - (calculateSalePrice(selectedSupply) * 0.05))}
                                                </span>
                                            </div>
                                            <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: '1rem', marginTop: '0.25rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Tag size={18} className="text-primary-400" /> Satış Fiyatı
                                                    </span>
                                                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-400)' }}>
                                                        {formatCurrency(calculateSalePrice(selectedSupply))}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h4 style={{ color: 'var(--gray-200)', marginBottom: '0.5rem' }}>Ürün Özellikleri</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: 'var(--dark-bg)', borderRadius: 'var(--radius)' }}>
                                                <span style={{ color: 'var(--gray-500)' }}>Ürün Kodu</span>
                                                <span style={{ fontWeight: 500 }}>{selectedSupply.code}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: 'var(--dark-bg)', borderRadius: 'var(--radius)' }}>
                                                <span style={{ color: 'var(--gray-500)' }}>Stok</span>
                                                <span style={{ fontWeight: 500 }}>{selectedSupply.stock} Adet</span>
                                            </div>
                                        </div>
                                    </div>

                                    <h4 style={{ color: 'var(--gray-200)', marginBottom: '0.5rem' }}>Açıklama</h4>
                                    <div
                                        style={{ color: 'var(--gray-400)', fontSize: '0.875rem', lineHeight: 1.6, maxHeight: '200px', overflowY: 'auto' }}
                                        dangerouslySetInnerHTML={{ __html: selectedSupply.description }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setShowModal(false)}>Pencereyi Kapat</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pricing Edit Modal */}
            {showEditModal && selectedSupply && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Fiyatlandırma Düzenle</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--dark-surface-2)', borderRadius: 'var(--radius)' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Ürün:</div>
                                <div style={{ fontWeight: 600 }}>{selectedSupply.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--primary-400)', marginTop: '0.25rem' }}>
                                    Tedarik Fiyatı: {formatCurrency(selectedSupply.price)}
                                </div>
                            </div>

                            <div className="grid grid-2" style={{ gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Kargo Firması</label>
                                    <select
                                        className="form-select"
                                        value={editForm.cargoCompany}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, cargoCompany: e.target.value }))}
                                    >
                                        {cargoCompanies.map(company => (
                                            <option key={company} value={company}>{company}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ürün Desi</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={editForm.desi}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, desi: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.1)',
                                borderRadius: '8px',
                                marginBottom: '1.5rem'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Kargo Gideri:</div>
                                    <div style={{ fontWeight: 600 }}>{formatCurrency(findCargoPrice(editForm.cargoCompany, editForm.desi))}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>İade Gideri (%5):</div>
                                    <div style={{ fontWeight: 600 }}>{formatCurrency(((selectedSupply.price + findCargoPrice(editForm.cargoCompany, editForm.desi)) * (1 + editForm.profitMargin / 100)) / (1 - 0.05 * (1 + editForm.profitMargin / 100)) * 0.05)}</div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Hedef Kar Marjı (%)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={editForm.profitMargin}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, profitMargin: Number(e.target.value) }))}
                                />
                            </div>

                            <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--primary-600)', borderRadius: 'var(--radius)', color: 'white' }}>
                                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Hesaplanan Yeni Satış Fiyatı:</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                                    {formatCurrency(((selectedSupply.price + findCargoPrice(editForm.cargoCompany, editForm.desi)) * (1 + editForm.profitMargin / 100)) / (1 - 0.05 * (1 + editForm.profitMargin / 100)))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>İptal</button>
                            <button className="btn btn-primary" onClick={handleUpdatePricing}>
                                Fiyatı Güncelle ve Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuppliesPage;
