import React, { useState, useMemo } from 'react';
import { Search, Info, Package, Filter, Download, ChevronRight, ChevronDown } from 'lucide-react';
import { PRODUCT_BOM } from '../data/excelData';
import { formatCurrency, searchFilter } from '../utils/helpers';

interface BOMPageProps {
    products: any[];
    materials: any[];
}

export const BOMPage: React.FC<BOMPageProps> = ({ products, materials }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

    const filteredProductNames = useMemo(() => {
        const allProductNames = Object.keys(PRODUCT_BOM);
        if (!searchQuery) return allProductNames;
        return allProductNames.filter(name =>
            name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const toggleExpand = (productName: string) => {
        const newExpanded = new Set(expandedProducts);
        if (newExpanded.has(productName)) {
            newExpanded.delete(productName);
        } else {
            newExpanded.add(productName);
        }
        setExpandedProducts(newExpanded);
    };

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ marginBottom: '0.25rem' }}>Ürün Reçeteleri (BOM)</h2>
                <p style={{ color: 'var(--gray-500)' }}>Excel'den aktarılan detaylı ürün ağacı ve hammadde listesi</p>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="search-box" style={{ maxWidth: '400px', width: '100%' }}>
                        <Search className="icon" size={18} />
                        <input
                            type="text"
                            placeholder="Ürün reçetesi ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-secondary">
                        <Download size={16} />
                        Excel İndir
                    </button>
                </div>
            </div>

            {/* BOM List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredProductNames.length > 0 ? (
                    filteredProductNames.map((productName) => {
                        const rawBomItems = PRODUCT_BOM[productName];

                        // Calculate dynamic prices based on current materials
                        const bomItems = rawBomItems.map(item => {
                            const foundMaterial = materials.find(m =>
                                m.name.toLowerCase() === item.material.toLowerCase()
                            );

                            if (foundMaterial) {
                                return {
                                    ...item,
                                    unitPrice: foundMaterial.unitPrice,
                                    price: foundMaterial.unitPrice * item.quantity
                                };
                            }
                            return {
                                ...item,
                                unitPrice: item.price / item.quantity,
                                price: item.price
                            };
                        });

                        const isExpanded = expandedProducts.has(productName);
                        const totalCost = bomItems.reduce((sum, item) => sum + item.price, 0);

                        return (
                            <div key={productName} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div
                                    style={{
                                        padding: '1.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        background: isExpanded ? 'var(--dark-surface-2)' : 'transparent'
                                    }}
                                    onClick={() => toggleExpand(productName)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--primary-400)'
                                        }}>
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, color: 'var(--gray-200)' }}>{productName}</h4>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                                {bomItems.length} kalem malzeme
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Toplam Malzeme Maliyeti</div>
                                            <div style={{ fontWeight: 600, color: 'var(--primary-400)' }}>{formatCurrency(totalCost)}</div>
                                        </div>
                                        {isExpanded ? <ChevronDown size={20} style={{ color: 'var(--gray-500)' }} /> : <ChevronRight size={20} style={{ color: 'var(--gray-500)' }} />}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={{ borderTop: '1px solid var(--dark-border)', padding: '1rem' }}>
                                        <div className="table-container">
                                            <table className="bom-table">
                                                <thead>
                                                    <tr>
                                                        <th>Kategori / Departman</th>
                                                        <th>Malzeme Adı</th>
                                                        <th>Miktar</th>
                                                        <th>Birim</th>
                                                        <th style={{ textAlign: 'right' }}>Birim Fiyat</th>
                                                        <th style={{ textAlign: 'right' }}>Toplam Fiyat</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bomItems.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td style={{ color: 'var(--gray-500)', fontSize: '0.8125rem' }}>{item.category}</td>
                                                            <td style={{ fontWeight: 500 }}>{item.material}</td>
                                                            <td>{item.quantity.toFixed(3)}</td>
                                                            <td>{item.unit}</td>
                                                            <td style={{ textAlign: 'right', color: 'var(--gray-400)' }}>
                                                                {formatCurrency(item.unitPrice)}
                                                            </td>
                                                            <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--gray-300)' }}>
                                                                {formatCurrency(item.price)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                        <td colSpan={5} style={{ textAlign: 'right', fontWeight: 600, padding: '1rem' }}>Genel Toplam:</td>
                                                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary-400)', fontSize: '1.125rem', padding: '1rem' }}>
                                                            {formatCurrency(totalCost)}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>

                                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                            <Info size={18} style={{ color: 'var(--primary-400)', marginTop: '0.125rem' }} />
                                            <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)', lineHeight: 1.5 }}>
                                                Bu veriler doğrudan Excel dosyasındaki <strong>'ürün ağaçları'</strong> sayfasından çekilmektedir.
                                                Birim fiyatlar ise <strong>'birim fiyatlar'</strong> sayfasındaki güncel verilerle hesaplanmaktadır.
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <Package size={48} style={{ color: 'var(--dark-border)', marginBottom: '1rem' }} />
                        <h4 style={{ color: 'var(--gray-400)' }}>Aramanıza uygun ürün reçetesi bulunamadı.</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BOMPage;
