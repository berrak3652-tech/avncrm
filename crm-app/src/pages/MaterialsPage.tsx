import React, { useState, useMemo } from 'react';
import {
    Search,
    Plus,
    Download,
    Edit2,
    Trash2,
    Wrench,
    Package,
    AlertTriangle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import type { Material } from '../types';
import { formatCurrency, searchFilter } from '../utils/helpers';

interface MaterialsPageProps {
    materials: Material[];
    onUpdateMaterial?: (material: Material) => void;
}

export const MaterialsPage: React.FC<MaterialsPageProps> = ({ materials, onUpdateMaterial }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const departments = useMemo(() => {
        const depts = new Set(materials.map(m => m.usedIn));
        return ['all', ...Array.from(depts)];
    }, [materials]);

    const stats = useMemo(() => ({
        total: materials.length,
        lowStock: materials.filter(m => m.stock < m.minStock).length,
        totalValue: materials.reduce((sum, m) => sum + (m.stock * m.unitPrice), 0)
    }), [materials]);

    const filteredMaterials = useMemo(() => {
        let result = materials;

        if (selectedDepartment !== 'all') {
            result = result.filter(m => m.usedIn === selectedDepartment);
        }

        if (searchQuery) {
            result = searchFilter(result, searchQuery, ['name', 'usedIn']);
        }

        return result;
    }, [materials, selectedDepartment, searchQuery]);

    const paginatedMaterials = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMaterials.slice(start, start + itemsPerPage);
    }, [filteredMaterials, currentPage]);

    const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-3 mb-6">
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', color: 'white' }}>
                        <Wrench size={24} />
                    </div>
                    <div className="value">{stats.total}</div>
                    <div className="label">Toplam Malzeme</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--warning), #D97706)', color: 'white' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className="value">{stats.lowStock}</div>
                    <div className="label">Düşük Stok Uyarısı</div>
                </div>
                <div className="stat-card">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, var(--secondary-500), var(--secondary-600))', color: 'white' }}>
                        <Package size={24} />
                    </div>
                    <div className="value">{formatCurrency(stats.totalValue)}</div>
                    <div className="label">Stok Değeri</div>
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
                                placeholder="Malzeme ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <select
                            className="form-select"
                            style={{ width: 'auto', minWidth: '180px' }}
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="all">Tüm Departmanlar</option>
                            {departments.filter(d => d !== 'all').map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
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
                            Yeni Malzeme
                        </button>
                    </div>
                </div>
            </div>

            {/* Materials Table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Malzeme Kodu</th>
                                <th>Malzeme Adı</th>
                                <th>Departman</th>
                                <th>Birim</th>
                                <th>Birim Fiyat</th>
                                <th>Stok</th>
                                <th>Stok Değeri</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedMaterials.map(material => (
                                <tr key={material.id}>
                                    <td style={{ fontWeight: 500, color: 'var(--primary-400)' }}>{material.id}</td>
                                    <td>
                                        <div style={{ fontWeight: 500, color: 'var(--gray-200)' }}>{material.name}</div>
                                    </td>
                                    <td>
                                        <span className="badge badge-primary">{material.usedIn}</span>
                                    </td>
                                    <td>{material.unit}</td>
                                    <td style={{ fontWeight: 500 }}>{formatCurrency(material.unitPrice)}</td>
                                    <td style={{
                                        color: material.stock < material.minStock ? 'var(--error)' : 'var(--gray-300)'
                                    }}>
                                        {material.stock} {material.unit}
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{formatCurrency(material.stock * material.unitPrice)}</td>
                                    <td>
                                        {material.stock < material.minStock ? (
                                            <span className="badge badge-error">Düşük Stok</span>
                                        ) : (
                                            <span className="badge badge-success">Yeterli</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
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
                        {filteredMaterials.length} malzemeden {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredMaterials.length)} gösteriliyor
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(page => (
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
        </div>
    );
};

export default MaterialsPage;
