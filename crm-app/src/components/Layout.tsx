import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    FileText,
    BarChart3,
    Settings,
    Truck,
    Wrench,
    Calculator,
    TrendingUp,
    Bell,
    Search,
    Menu,
    X,
    ChevronDown,
    LogOut,
    User
} from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const navItems = [
    {
        section: 'Ana Menü',
        items: [
            { path: '/', icon: LayoutDashboard, label: 'Dashboard', badge: null },
            { path: '/orders', icon: ShoppingCart, label: 'Siparişler', badge: 12 },
            { path: '/products', icon: Package, label: 'Ürünler', badge: null },
            { path: '/customers', icon: Users, label: 'Müşteriler', badge: null },
        ]
    },
    {
        section: 'Maliyet & Fiyat',
        items: [
            { path: '/materials', icon: Wrench, label: 'Malzemeler', badge: null },
            { path: '/labor', icon: Calculator, label: 'İşçilik', badge: null },
            { path: '/cargo', icon: Truck, label: 'Kargo Fiyatları', badge: null },
        ]
    },
    {
        section: 'Raporlar',
        items: [
            { path: '/reports', icon: FileText, label: 'Satış Raporları', badge: null },
            { path: '/analytics', icon: BarChart3, label: 'Analizler', badge: null },
            { path: '/channels', icon: TrendingUp, label: 'Satış Kanalları', badge: null },
        ]
    },
    {
        section: 'Sistem',
        items: [
            { path: '/settings', icon: Settings, label: 'Ayarlar', badge: null },
        ]
    }
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        const item = navItems.flatMap(s => s.items).find(i => i.path === path);
        return item?.label || 'CRM';
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-icon">B</div>
                        <span className="logo-text">Berta CRM</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((section) => (
                        <div key={section.section} className="nav-section">
                            <div className="nav-section-title">{section.section}</div>
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="icon" size={20} />
                                    <span>{item.label}</span>
                                    {item.badge && <span className="badge-count">{item.badge}</span>}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--dark-border)' }}>
                    <div className="user-menu" style={{ width: '100%' }}>
                        <div className="user-avatar">A</div>
                        <div className="user-info">
                            <div className="user-name">Admin</div>
                            <div className="user-role">Yönetici</div>
                        </div>
                        <ChevronDown size={16} style={{ marginLeft: 'auto', color: 'var(--gray-400)' }} />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="header">
                    <div className="header-left">
                        <button
                            className="btn btn-ghost btn-icon mobile-menu-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h1 className="header-title">{getPageTitle()}</h1>
                    </div>

                    <div className="header-right">
                        <div className="search-box">
                            <Search className="icon" size={18} />
                            <input type="text" placeholder="Ara... (Ctrl+K)" />
                        </div>

                        <div className="header-actions">
                            <button
                                className="notification-btn"
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                            >
                                <Bell size={20} />
                                <span className="badge">5</span>
                            </button>
                        </div>

                        <div className="user-menu" onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ cursor: 'pointer', position: 'relative' }}>
                            <div className="user-avatar">A</div>
                            <div className="user-info">
                                <div className="user-name">Admin</div>
                                <div className="user-role">Yönetici</div>
                            </div>
                            {userMenuOpen && (
                                <div className="card" style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    width: '180px',
                                    marginTop: '0.5rem',
                                    padding: '0.5rem',
                                    zIndex: 100
                                }}>
                                    <button className="nav-item" style={{ width: '100%' }} onClick={() => alert('Profil ayarları yakında...')}>
                                        <User size={16} /> Profil
                                    </button>
                                    <button className="nav-item" style={{ width: '100%', color: 'var(--error)' }} onClick={() => alert('Çıkış yapılıyor...')}>
                                        <LogOut size={16} /> Çıkış Yap
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="page-content">
                    {children}
                </div>
            </main>

            {/* Notification Panel */}
            {notificationsOpen && (
                <div
                    className="modal-overlay"
                    onClick={() => setNotificationsOpen(false)}
                    style={{ background: 'transparent' }}
                >
                    <div
                        className="card"
                        style={{
                            position: 'fixed',
                            top: '70px',
                            right: '20px',
                            width: '360px',
                            maxHeight: '400px',
                            overflow: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header">
                            <h4 className="card-title">Bildirimler</h4>
                            <button className="btn btn-ghost btn-sm">Tümünü Okundu İşaretle</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <NotificationItem
                                icon={<ShoppingCart size={16} />}
                                title="Yeni sipariş alındı"
                                message="SP-2024-00125 numaralı sipariş"
                                time="5 dk önce"
                                type="order"
                            />
                            <NotificationItem
                                icon={<Package size={16} />}
                                title="Stok uyarısı"
                                message="CUBO ürünü stokta azaldı"
                                time="1 saat önce"
                                type="stock"
                            />
                            <NotificationItem
                                icon={<Users size={16} />}
                                title="Yeni müşteri kaydı"
                                message="Ahmet Yılmaz kayıt oldu"
                                time="2 saat önce"
                                type="customer"
                            />
                            <NotificationItem
                                icon={<TrendingUp size={16} />}
                                title="Haftalık rapor hazır"
                                message="Satış raporunu görüntüle"
                                time="1 gün önce"
                                type="report"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="modal-overlay"
                    onClick={() => setSidebarOpen(false)}
                    style={{ zIndex: 99 }}
                />
            )}
        </div>
    );
};

interface NotificationItemProps {
    icon: React.ReactNode;
    title: string;
    message: string;
    time: string;
    type: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ icon, title, message, time, type }) => {
    const bgColors: Record<string, string> = {
        order: 'rgba(99, 102, 241, 0.2)',
        stock: 'rgba(245, 158, 11, 0.2)',
        customer: 'rgba(34, 197, 94, 0.2)',
        report: 'rgba(59, 130, 246, 0.2)'
    };

    return (
        <div style={{
            display: 'flex',
            gap: '0.75rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius)',
            background: 'var(--dark-surface-2)',
            cursor: 'pointer',
            transition: 'all var(--transition)'
        }}>
            <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius)',
                background: bgColors[type],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--gray-200)' }}>{title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.125rem' }}>{message}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>{time}</div>
            </div>
        </div>
    );
};

export default Layout;
