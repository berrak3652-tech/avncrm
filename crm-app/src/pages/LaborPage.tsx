import React, { useState, useMemo } from 'react';
import { Calculator, Clock, Users, DollarSign, Edit2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface LaborItem {
    id: string;
    productName: string;
    moduleName: string;
    piecesPerPerson: number;
    hourlyWage: number;
    totalLabor: number;
}

interface LaborPageProps {
    laborData: LaborItem[];
    onUpdateLabor?: (labor: LaborItem) => void;
}

export const LaborPage: React.FC<LaborPageProps> = ({ laborData, onUpdateLabor }) => {
    const [showGlobalModal, setShowGlobalModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<LaborItem | null>(null);
    const [editForm, setEditForm] = useState<Partial<LaborItem>>({});
    const [hourlyWage, setHourlyWage] = useState(laborData[0]?.hourlyWage || 110);
    const stats = useMemo(() => ({
        totalProducts: laborData.length,
        avgPiecesPerPerson: laborData.reduce((sum, l) => sum + l.piecesPerPerson, 0) / laborData.length,
        avgLaborCost: laborData.reduce((sum, l) => sum + l.totalLabor, 0) / laborData.length,
        hourlyWage: laborData[0]?.hourlyWage || 110
    }), [laborData]);

    return (
        <div>
            <div className="grid grid-4 mb-6">
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', color: 'white' }}>
                        <Calculator size={24} />
                    </div>
                    <div className="value">{stats.totalProducts}</div>
                    <div className="label">Ürün Sayısı</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--secondary-500), var(--secondary-600))', color: 'white' }}>
                        <Users size={24} />
                    </div>
                    <div className="value">{stats.avgPiecesPerPerson.toFixed(1)}</div>
                    <div className="label">Ort. Kişi/Adet</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))', color: 'white' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className="value">{formatCurrency(stats.avgLaborCost)}</div>
                    <div className="label">Ort. İşçilik Maliyeti</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white' }}>
                        <Clock size={24} />
                    </div>
                    <div className="value">{formatCurrency(stats.hourlyWage)}</div>
                    <div className="label">Saat Ücreti</div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">İşçilik Maliyetleri</h3>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowGlobalModal(true)}>
                        <Edit2 size={16} />
                        Saat Ücretini Düzenle
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Ürün Adı</th>
                                <th>Modül Adı</th>
                                <th>Bir Kişi Kaç Adet Yapar</th>
                                <th>Saat Ücreti</th>
                                <th>Toplam İşçilik</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {laborData.map(labor => (
                                <tr key={labor.id}>
                                    <td style={{ fontWeight: 500, color: 'var(--gray-200)' }}>{labor.productName}</td>
                                    <td>
                                        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {labor.moduleName}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            background: 'rgba(99, 102, 241, 0.2)',
                                            color: 'var(--primary-400)',
                                            borderRadius: 'var(--radius)',
                                            fontSize: '0.875rem'
                                        }}>
                                            {labor.piecesPerPerson} adet
                                        </span>
                                    </td>
                                    <td>{formatCurrency(labor.hourlyWage)}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--secondary-400)' }}>
                                        {formatCurrency(labor.totalLabor)}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={() => {
                                                setSelectedItem(labor);
                                                setEditForm(labor);
                                                setShowItemModal(true);
                                            }}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Edit Hourly Wage Modal - Global */}
            {showGlobalModal && (
                <div className="modal-overlay" onClick={() => setShowGlobalModal(false)}>
                    <div className="modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Saat Ücretini Güncelle</h3>
                            <button className="modal-close" onClick={() => setShowGlobalModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Yeni Saat Ücreti (₺)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={hourlyWage}
                                    onChange={(e) => setHourlyWage(Number(e.target.value))}
                                />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                                Not: Bu işlem tüm ürünlerin saat ücretini ve toplam işçilik maliyetini güncelleyecektir.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowGlobalModal(false)}>İptal</button>
                            <button className="btn btn-primary" onClick={() => {
                                if (onUpdateLabor) {
                                    // Update all items with new wage
                                    laborData.forEach(item => {
                                        onUpdateLabor({
                                            ...item,
                                            hourlyWage: hourlyWage,
                                            totalLabor: (hourlyWage / item.piecesPerPerson) * 9 // This is the existing calculation logic if 8 - 9 hours
                                        });
                                    });
                                }
                                alert('Tüm saat ücretleri güncellendi.');
                                setShowGlobalModal(false);
                            }}>
                                <Edit2 size={16} />
                                Tümünü Güncelle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Individual Labor Item Modal */}
            {showItemModal && selectedItem && (
                <div className="modal-overlay" onClick={() => setShowItemModal(false)}>
                    <div className="modal" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">İşçilik Detayı: {selectedItem.productName}</h3>
                            <button className="modal-close" onClick={() => setShowItemModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Ürün Adı</label>
                                <input type="text" className="form-input" value={editForm.productName || ''} readOnly style={{ opacity: 0.7 }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Bir Kişi Kaç Adet Yapar</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={editForm.piecesPerPerson || 0}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        const wage = editForm.hourlyWage || 110;
                                        setEditForm({
                                            ...editForm,
                                            piecesPerPerson: val,
                                            totalLabor: val > 0 ? (wage * 9) / val : 0 // Using 9 as the multiplier based on Excel logic
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Saat Ücreti (₺)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={editForm.hourlyWage || 0}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        const pieces = editForm.piecesPerPerson || 1;
                                        setEditForm({
                                            ...editForm,
                                            hourlyWage: val,
                                            totalLabor: pieces > 0 ? (val * 9) / pieces : 0
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Toplam İşçilik Maliyeti (₺)</label>
                                <input type="text" className="form-input" value={formatCurrency(editForm.totalLabor || 0)} readOnly style={{ background: 'var(--dark-bg)' }} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowItemModal(false)}>İptal</button>
                            <button className="btn btn-primary" onClick={() => {
                                if (onUpdateLabor && selectedItem) {
                                    onUpdateLabor({ ...selectedItem, ...editForm } as LaborItem);
                                }
                                alert('İşçilik verisi güncellendi.');
                                setShowItemModal(false);
                            }}>
                                <Edit2 size={16} />
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LaborPage;
