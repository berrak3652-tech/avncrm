import React, { useMemo } from 'react';
import { Truck, Calculator, Edit2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface CargoPriceItem {
    id: string;
    desi: number;
    price: number;
}

interface CargoPageProps {
    cargoPrices: CargoPriceItem[];
    onUpdatePrice?: (price: CargoPriceItem) => void;
}

export const CargoPage: React.FC<CargoPageProps> = ({ cargoPrices }) => {
    const stats = useMemo(() => ({
        minPrice: Math.min(...cargoPrices.map(p => p.price)),
        maxPrice: Math.max(...cargoPrices.map(p => p.price)),
        avgPrice: cargoPrices.reduce((sum, p) => sum + p.price, 0) / cargoPrices.length
    }), [cargoPrices]);

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
                <div className="card-header">
                    <h3 className="card-title">Horoz Lojistik Kargo Fiyat Tablosu</h3>
                    <button className="btn btn-primary btn-sm">
                        <Edit2 size={16} />
                        Fiyatları Düzenle
                    </button>
                </div>

                <div className="grid grid-4" style={{ gap: '1rem' }}>
                    {cargoPrices.map(price => (
                        <div
                            key={price.id}
                            style={{
                                padding: '1rem',
                                background: 'var(--dark-surface-2)',
                                borderRadius: 'var(--radius)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: '1px solid var(--dark-border)'
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
                            <input type="number" className="form-input" placeholder="Desi değeri girin" defaultValue={30} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Adet</label>
                            <input type="number" className="form-input" placeholder="Adet" defaultValue={1} />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }}>
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
                            {formatCurrency(282)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                            30 desi için hesaplandı
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CargoPage;
