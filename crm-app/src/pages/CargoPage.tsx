import React, { useState, useMemo } from 'react';
import { Truck, Calculator, Edit2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface CargoPriceItem {
    id: string;
    company: string;
    desi: number;
    price: number;
}

interface CargoPageProps {
    cargoPrices: CargoPriceItem[];
    onUpdatePrice?: (price: CargoPriceItem) => void;
    onUpdateAllPrices?: (percentage: number, fixedAdd: number, company: string, setPrice?: number, thresholdConfig?: { threshold: number, basePrice: number, perDesi: number }) => void;
    onResetAllPrices?: (company: string) => void;
}

import { Plus } from 'lucide-react';

export const CargoPage: React.FC<CargoPageProps> = ({ cargoPrices, onUpdateAllPrices, onResetAllPrices, onUpdatePrice }) => {
    const companies = useMemo(() => Array.from(new Set(cargoPrices.map(p => p.company))), [cargoPrices]);
    const [selectedCompany, setSelectedCompany] = useState<string>(companies[0] || 'Horoz Lojistik');

    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
    const [newCompanyName, setNewCompanyName] = useState('');

    // Reset inputs when modal opens
    React.useEffect(() => {
        if (!showEditModal) {
            setPercentage(0);
            setFixedAdd(0);
            setSetPrice(0);
        }
    }, [showEditModal]);

    const filteredPrices = useMemo(() => cargoPrices.filter(p => p.company === selectedCompany), [cargoPrices, selectedCompany]);

    const [calcDesi, setCalcDesi] = useState(30);
    const [calcQty, setCalcQty] = useState(1);
    const [calcResult, setCalcResult] = useState<number | null>(null);
    const [percentage, setPercentage] = useState(0);
    const [fixedAdd, setFixedAdd] = useState(0);
    const [setPrice, setSetPrice] = useState(0);
    const [threshold, setThreshold] = useState(30);
    const [basePrice, setBasePrice] = useState(0);
    const [perDesi, setPerDesi] = useState(0);
    const [activeTab, setActiveTab] = useState<'bulk' | 'threshold'>('bulk');

    const stats = useMemo(() => {
        if (filteredPrices.length === 0) return { minPrice: 0, maxPrice: 0, avgPrice: 0 };
        return {
            minPrice: Math.min(...filteredPrices.map(p => p.price)),
            maxPrice: Math.max(...filteredPrices.map(p => p.price)),
            avgPrice: filteredPrices.reduce((sum, p) => sum + p.price, 0) / filteredPrices.length
        };
    }, [filteredPrices]);

    return (
        <div>
            <div className="grid grid-3 mb-6">
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--secondary-500), var(--secondary-600))', color: 'white' }}>
                        <Truck size={24} />
                    </div>
                    <div className="value">{formatCurrency(stats.minPrice)}</div>
                    <div className="label">Minimum Fiyat (0-30 Desi)</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', color: 'white' }}>
                        <Calculator size={24} />
                    </div>
                    <div className="value">{formatCurrency(stats.avgPrice)}</div>
                    <div className="label">Ortalama Fiyat</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))', color: 'white' }}>
                        <Truck size={24} />
                    </div>
                    <div className="value">{formatCurrency(stats.maxPrice)}</div>
                    <div className="label">Maksimum Fiyat (210+ Desi)</div>
                </div>
            </div>

            <div className="card mb-6">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <h3 className="card-title" style={{ margin: 0 }}>Kargo Fiyat Tablosu</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <select
                                className="form-select"
                                style={{ minWidth: '180px', padding: '0.4rem 0.75rem' }}
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                            >
                                {companies.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <button
                                className="btn btn-ghost btn-icon"
                                title="Yeni Firma Ekle"
                                onClick={() => setShowAddCompanyModal(true)}
                                style={{ height: '38px', width: '38px' }}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowAddCompanyModal(true)}
                        >
                            <Plus size={16} />
                            Firma Ekle
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowEditModal(true)}>
                            <Edit2 size={16} />
                            {selectedCompany} Fiyatlarını Düzenle
                        </button>
                    </div>
                </div>

                <div className="grid grid-4" style={{ gap: '1rem' }}>
                    {filteredPrices.map(price => (
                        <div
                            key={price.id}
                            className="cargo-price-card"
                            onClick={() => {
                                const newPrice = prompt(`${price.desi} Desi için yeni fiyat (₺):`, price.price.toString());
                                if (newPrice !== null && !isNaN(Number(newPrice))) {
                                    if (onUpdatePrice) onUpdatePrice({ ...price, price: Number(newPrice) });
                                }
                            }}
                            style={{
                                padding: '1rem',
                                background: 'var(--dark-surface-2)',
                                borderRadius: 'var(--radius)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: '1px solid var(--dark-border)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Desi</div>
                                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-200)' }}>{price.desi}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Fiyat</div>
                                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--secondary-400)' }}>
                                    {formatCurrency(price.price)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Kargo Hesaplayıcı</h3>
                </div>
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                    <div>
                        <div className="form-group">
                            <label className="form-label">Ürün Desi</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Desi değeri girin"
                                value={calcDesi}
                                onChange={(e) => setCalcDesi(Number(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Adet</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Adet"
                                value={calcQty}
                                onChange={(e) => setCalcQty(Number(e.target.value))}
                            />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => {
                            // Simple calculation logic for simulation
                            const sorted = [...filteredPrices].sort((a, b) => a.desi - b.desi);
                            if (sorted.length === 0) return;
                            const priceItem = sorted.find(p => calcDesi <= p.desi) || sorted[sorted.length - 1];
                            setCalcResult(priceItem.price * calcQty);
                        }}>
                            <Calculator size={16} />
                            Hesapla
                        </button>
                    </div>
                    <div style={{
                        background: 'var(--dark-surface-2)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>
                            Tahmini Kargo Ücreti
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-400)' }}>
                            {calcResult !== null ? formatCurrency(calcResult) : '-'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                            {calcDesi} desi ve {calcQty} adet için hesaplandı
                        </div>
                    </div>
                </div>
            </div>
            {/* Edit Prices Modal */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Kargo Fiyatlarını Güncelle</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--dark-bg)', padding: '0.25rem', borderRadius: 'var(--radius)' }}>
                                <button
                                    className={`btn btn-sm ${activeTab === 'bulk' ? 'btn-primary' : 'btn-ghost'}`}
                                    style={{ flex: 1 }}
                                    onClick={() => setActiveTab('bulk')}
                                >Toplu Genel</button>
                                <button
                                    className={`btn btn-sm ${activeTab === 'threshold' ? 'btn-primary' : 'btn-ghost'}`}
                                    style={{ flex: 1 }}
                                    onClick={() => setActiveTab('threshold')}
                                >Kademeli Artış</button>
                            </div>

                            {activeTab === 'bulk' ? (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Tüm Fiyatlara Uygulanacak Artış (%)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="0"
                                            value={percentage || ''}
                                            onChange={(e) => setPercentage(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Veya Desi Başına Sabit Ücret Ekle (₺)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="0"
                                            value={fixedAdd || ''}
                                            onChange={(e) => setFixedAdd(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tüm Fiyatları Sabitle (₺)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="Her desi için aynı fiyat"
                                            value={setPrice || ''}
                                            onChange={(e) => setSetPrice(Number(e.target.value))}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Eşik Desi (Sınır)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={threshold}
                                            onChange={(e) => setThreshold(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Sınır Altı Sabit Fiyat (₺)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="Örn: 30 Desiye kadar 200 TL"
                                            value={basePrice || ''}
                                            onChange={(e) => setBasePrice(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Sınır Üstü Desi Başı Artış (₺)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="Örn: 30 Desiden sonra her desi +5 TL"
                                            value={perDesi || ''}
                                            onChange={(e) => setPerDesi(Number(e.target.value))}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                        Hesaplama: Eşik altında sabit fiyat, eşik üzerinde her bir desi için ilave ücret eklenir.
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>İptal</button>
                            <button className="btn btn-primary" onClick={() => {
                                if (onUpdateAllPrices) {
                                    if (activeTab === 'bulk') {
                                        onUpdateAllPrices(percentage, fixedAdd, selectedCompany, setPrice);
                                    } else {
                                        onUpdateAllPrices(0, 0, selectedCompany, 0, { threshold, basePrice, perDesi });
                                    }
                                }
                                alert(`${selectedCompany} fiyatları başarıyla güncellendi.`);
                                setShowEditModal(false);
                            }}>
                                <Edit2 size={16} />
                                Uygula ve Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Add Company Modal */}
            {showAddCompanyModal && (
                <div className="modal-overlay" onClick={() => setShowAddCompanyModal(false)}>
                    <div className="modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Yeni Kargo Firmanısı Ekle</h3>
                            <button className="modal-close" onClick={() => setShowAddCompanyModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Firma Adı</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Örn: Aras Kargo, MNG..."
                                    value={newCompanyName}
                                    onChange={(e) => setNewCompanyName(e.target.value)}
                                />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                Not: Yeni firma eklendiğinde Horoz Lojistik fiyatları şablon olarak kopyalanacaktır.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => {
                                if (onResetAllPrices && confirm(`${selectedCompany} fiyatları Excel'deki orijinal değerlerine döndürülecek. Emin misiniz?`)) {
                                    onResetAllPrices(selectedCompany);
                                }
                            }}>Orijinal Fiyatlara Dön</button>
                            <button className="btn btn-primary" onClick={() => {
                                if (newCompanyName && onUpdateAllPrices) {
                                    onUpdateAllPrices(0, 0, `NEW:${newCompanyName}`);
                                    setSelectedCompany(newCompanyName);
                                    setShowAddCompanyModal(false);
                                    setNewCompanyName('');
                                }
                            }}>
                                <Plus size={16} />
                                Firma Oluştur
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CargoPage;
