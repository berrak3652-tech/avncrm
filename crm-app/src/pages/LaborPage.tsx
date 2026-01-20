import React, { useMemo } from 'react';
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

export const LaborPage: React.FC<LaborPageProps> = ({ laborData }) => {
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
                    <button className="btn btn-primary btn-sm">
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
                                        <button className="btn btn-ghost btn-icon">
                                            <Edit2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LaborPage;
