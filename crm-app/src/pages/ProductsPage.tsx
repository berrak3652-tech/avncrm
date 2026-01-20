import React, { useState, useMemo } from 'react';
import {
    Search,
    Plus,
    Filter,
    Download,
    Edit2,
    Trash2,
    Eye,
    Package,
    TrendingUp,
    TrendingDown,
    MoreVertical,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { formatCurrency, formatPercentage, searchFilter } from '../utils/helpers';

interface ProductsPageProps {
    products: any[];
    onUpdateProduct?: (product: any) => void;
    onDeleteProduct?: (id: string) => void;
}

const categories = [
    'Tümü',
    'Çalışma Masası',
    'TV Ünitesi',
    'Kitaplık',
    'Tabure',
    'Oturak',
    'Bahçe Mobilyası',
    'Kamp Ürünleri',
    'Diğer'
];

export const ProductsPage: React.FC<ProductsPageProps> = ({ products, onUpdateProduct, onDeleteProduct }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tümü');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const itemsPerPage = 10;

    const filteredProducts = useMemo(() => {
        let result = products;

        if (selectedCategory !== 'Tümü') {
            result = result.filter(p => p.category === selectedCategory);
        }

        if (searchQuery) {
            result = searchFilter(result, searchQuery, ['name', 'moduleName', 'category']);
        }

        return result;
    }, [products, selectedCategory, searchQuery]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const stats = useMemo(() => ({
        total: products.length,
        active: products.filter(p => p.status === 'active').length,
        lowStock: products.filter(p => p.stock < 10).length,
        avgProfit: products.reduce((sum, p) => sum + p.profitMargin, 0) / products.length
    }), [products]);

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-4 mb-6">
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', color: 'white' }}>
                        <Package size={24} />
                    </div>
                    <div className="value">{stats.total}</div>
                    <div className="label">Toplam Ürün</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--secondary-500), var(--secondary-600))', color: 'white' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="value">{stats.active}</div>
                    <div className="label">Aktif Ürün</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--warning), #D97706)', color: 'white' }}>
                        <TrendingDown size={24} />
                    </div>
                    <div className="value">{stats.lowStock}</div>
                    <div className="label">Düşük Stok</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="value">{formatPercentage(stats.avgProfit)}</div>
                    <div className="label">Ort. Kar Marjı</div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="card mb-6">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div className="search-box" style={{ maxWidth: '300px' }}>
                            <Search className="icon" size={18} />
                            <input
                                type="text"
                                placeholder="Ürün ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <select
                            className="form-select"
                            style={{ width: 'auto', minWidth: '180px' }}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button className="btn btn-secondary">
                            <Download size={16} />
                            Excel
                        </button>
                        <button className="btn btn-primary">
                            <Plus size={16} />
                            Yeni Ürün
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Ürün Adı</th>
                                <th>Kategori</th>
                                <th>Maliyet</th>
                                <th>Satış Fiyatı</th>
                                <th>Kar</th>
                                <th>Kar Marjı</th>
                                <th>Stok</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 500, color: 'var(--gray-200)' }}>{product.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{product.moduleName}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-primary">{product.category}</span>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{formatCurrency(product.totalCost)}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--primary-400)' }}>
                                        {product.salePrice > 0 ? formatCurrency(product.salePrice) : '-'}
                                    </td>
                                    <td style={{ fontWeight: 500 }} className={product.profit >= 0 ? 'price-positive' : 'price-negative'}>
                                        {formatCurrency(product.profit)}
                                    </td>
                                    <td className={product.profitMargin >= 0 ? 'price-positive' : 'price-negative'}>
                                        {formatPercentage(product.profitMargin)}
                                    </td>
                                    <td>
                                        <span style={{
                                            color: product.stock < 10 ? 'var(--error)' : product.stock < 20 ? 'var(--warning)' : 'var(--secondary-400)'
                                        }}>
                                            {product.stock} adet
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${product.status === 'active' ? 'badge-success' : product.status === 'out_of_stock' ? 'badge-error' : 'badge-warning'}`}>
                                            {product.status === 'active' ? 'Aktif' : product.status === 'out_of_stock' ? 'Stok Yok' : 'Pasif'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button
                                                className="btn btn-ghost btn-icon"
                                                onClick={() => { setSelectedProduct(product); setShowModal(true); }}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button className="btn btn-ghost btn-icon">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn btn-ghost btn-icon" style={{ color: 'var(--error)' }}>
                                                <Trash2 size={16} />
                                            </button>
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
                        {filteredProducts.length} üründen {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)} gösteriliyor
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

            {/* Product Detail Modal */}
            {showModal && selectedProduct && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{selectedProduct.name}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="grid grid-2" style={{ gap: '2rem' }}>
                                <div>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--gray-300)' }}>Ürün Bilgileri</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <InfoRow label="Ürün Kodu" value={selectedProduct.id} />
                                        <InfoRow label="Modül Adı" value={selectedProduct.moduleName} />
                                        <InfoRow label="Kategori" value={selectedProduct.category} />
                                        <InfoRow label="Desi" value={`${selectedProduct.desi} desi`} />
                                        <InfoRow label="Stok" value={`${selectedProduct.stock} adet`} />
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--gray-300)' }}>Maliyet Detayları</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <InfoRow label="Malzeme Maliyeti" value={formatCurrency(selectedProduct.materialCost)} />
                                        <InfoRow label="İşçilik Maliyeti" value={formatCurrency(selectedProduct.laborCost)} />
                                        <InfoRow label="Genel Gider" value={formatCurrency(selectedProduct.overheadCost)} />
                                        <InfoRow label="İade Gideri" value={formatCurrency(selectedProduct.returnCost)} />
                                        <InfoRow label="Kargo Maliyeti" value={formatCurrency(selectedProduct.cargoCost)} />
                                        <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: '0.75rem' }}>
                                            <InfoRow label="Toplam Maliyet" value={formatCurrency(selectedProduct.totalCost)} highlight />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-300)' }}>Satış Kanalları Fiyatları</h4>
                                <div className="grid grid-4" style={{ gap: '1rem' }}>
                                    <PriceCard channel="Trendyol" price={selectedProduct.salePrice} color="#F27A1A" />
                                    <PriceCard channel="Hepsiburada" price={selectedProduct.hepsiburadaPrice} color="#FF6000" />
                                    <PriceCard channel="Vivense" price={selectedProduct.vivensePrice} color="#00BCD4" />
                                    <PriceCard channel="Koçtaş" price={selectedProduct.koctasPrice} color="#FF9800" />
                                </div>
                            </div>
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
        </div>
    );
};

const InfoRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--gray-500)' }}>{label}</span>
        <span style={{ fontWeight: highlight ? 600 : 500, color: highlight ? 'var(--primary-400)' : 'var(--gray-200)' }}>{value}</span>
    </div>
);

const PriceCard: React.FC<{ channel: string; price: number; color: string }> = ({ channel, price, color }) => (
    <div style={{
        padding: '1rem',
        background: 'var(--dark-surface-2)',
        borderRadius: 'var(--radius)',
        borderLeft: `3px solid ${color}`
    }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>{channel}</div>
        <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-200)' }}>
            {price > 0 ? formatCurrency(price) : '-'}
        </div>
    </div>
);

export default ProductsPage;
