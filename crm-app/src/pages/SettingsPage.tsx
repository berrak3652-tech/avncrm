import React, { useState } from 'react';
import {
    Settings,
    User,
    Building,
    Bell,
    Shield,
    Palette,
    Database,
    Mail,
    Save,
    Upload,
    FileSpreadsheet
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('company');

    const tabs = [
        { id: 'company', label: 'Şirket Bilgileri', icon: Building },
        { id: 'user', label: 'Kullanıcı Ayarları', icon: User },
        { id: 'notifications', label: 'Bildirimler', icon: Bell },
        { id: 'security', label: 'Güvenlik', icon: Shield },
        { id: 'appearance', label: 'Görünüm', icon: Palette },
        { id: 'integrations', label: 'Entegrasyonlar', icon: Database },
    ];

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ marginBottom: '0.25rem' }}>Ayarlar</h2>
                <p style={{ color: 'var(--gray-500)' }}>Sistem ve kullanıcı ayarlarını yönetin</p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '250px 1fr', gap: '1.5rem' }}>
                {/* Sidebar */}
                <div className="card" style={{ padding: '0.5rem', height: 'fit-content' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ width: '100%', textAlign: 'left' }}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="card">
                    {activeTab === 'company' && <CompanySettings />}
                    {activeTab === 'user' && <UserSettings />}
                    {activeTab === 'notifications' && <NotificationSettings />}
                    {activeTab === 'security' && <SecuritySettings />}
                    {activeTab === 'appearance' && <AppearanceSettings />}
                    {activeTab === 'integrations' && <IntegrationSettings />}
                </div>
            </div>
        </div>
    );
};

const CompanySettings: React.FC = () => (
    <div>
        <h3 style={{ marginBottom: '1.5rem' }}>Şirket Bilgileri</h3>

        <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
                <label className="form-label">Şirket Adı</label>
                <input type="text" className="form-input" defaultValue="Avyna Concept" />
            </div>
            <div className="form-group">
                <label className="form-label">Vergi No</label>
                <input type="text" className="form-input" defaultValue="1234567890" />
            </div>
        </div>

        <div className="form-group">
            <label className="form-label">Adres</label>
            <textarea className="form-textarea" defaultValue="İzmir, Türkiye"></textarea>
        </div>

        <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
                <label className="form-label">Telefon</label>
                <input type="tel" className="form-input" defaultValue="+90 232 XXX XX XX" />
            </div>
            <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" defaultValue="info@avynaconcept.com" />
            </div>
        </div>

        <div className="form-group">
            <label className="form-label">Logo</label>
            <div style={{
                padding: '2rem',
                border: '2px dashed var(--dark-border)',
                borderRadius: 'var(--radius)',
                textAlign: 'center'
            }}>
                <Upload size={32} style={{ color: 'var(--gray-500)', marginBottom: '0.5rem' }} />
                <p style={{ color: 'var(--gray-500)' }}>Logo yüklemek için tıklayın veya sürükleyin</p>
            </div>
        </div>

        <button className="btn btn-primary" onClick={() => alert('Şirket ayarları başarıyla kaydedildi.')}>
            <Save size={16} />
            Kaydet
        </button>
    </div>
);

const UserSettings: React.FC = () => (
    <div>
        <h3 style={{ marginBottom: '1.5rem' }}>Kullanıcı Ayarları</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 600,
                color: 'white'
            }}>
                A
            </div>
            <div>
                <h4 style={{ marginBottom: '0.5rem' }}>Admin</h4>
                <button className="btn btn-secondary btn-sm">Fotoğraf Değiştir</button>
            </div>
        </div>

        <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
                <label className="form-label">Ad</label>
                <input type="text" className="form-input" defaultValue="Admin" />
            </div>
            <div className="form-group">
                <label className="form-label">Soyad</label>
                <input type="text" className="form-input" defaultValue="User" />
            </div>
        </div>

        <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" defaultValue="admin@bertaconcept.com" />
        </div>

        <div className="form-group">
            <label className="form-label">Telefon</label>
            <input type="tel" className="form-input" defaultValue="+90 5XX XXX XX XX" />
        </div>

        <button className="btn btn-primary" onClick={() => alert('Kullanıcı ayarları başarıyla kaydedildi.')}>
            <Save size={16} />
            Kaydet
        </button>
    </div>
);

const NotificationSettings: React.FC = () => (
    <div>
        <h3 style={{ marginBottom: '1.5rem' }}>Bildirim Ayarları</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <NotificationToggle label="Yeni sipariş bildirimleri" description="Yeni sipariş geldiğinde bildirim al" defaultChecked />
            <NotificationToggle label="Stok uyarıları" description="Düşük stok durumunda bildirim al" defaultChecked />
            <NotificationToggle label="Müşteri mesajları" description="Müşterilerden gelen mesajlar için bildirim al" defaultChecked />
            <NotificationToggle label="Haftalık raporlar" description="Haftalık satış raporlarını email ile al" />
            <NotificationToggle label="Aylık özet" description="Aylık performans özetini email ile al" />
        </div>

        <div style={{ marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => alert('Bildirim ayarları başarıyla kaydedildi.')}>
                <Save size={16} />
                Kaydet
            </button>
        </div>
    </div>
);

const NotificationToggle: React.FC<{ label: string; description: string; defaultChecked?: boolean }> = ({
    label, description, defaultChecked
}) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        background: 'var(--dark-surface-2)',
        borderRadius: 'var(--radius)'
    }}>
        <div>
            <div style={{ fontWeight: 500, color: 'var(--gray-200)' }}>{label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{description}</div>
        </div>
        <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
            <input
                type="checkbox"
                defaultChecked={defaultChecked}
                style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
                position: 'absolute',
                cursor: 'pointer',
                inset: 0,
                background: defaultChecked ? 'var(--primary-500)' : 'var(--dark-border)',
                borderRadius: '24px',
                transition: 'all var(--transition)'
            }}>
                <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: defaultChecked ? '27px' : '3px',
                    bottom: '3px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'all var(--transition)'
                }} />
            </span>
        </label>
    </div>
);

const SecuritySettings: React.FC = () => (
    <div>
        <h3 style={{ marginBottom: '1.5rem' }}>Güvenlik Ayarları</h3>

        <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Şifre Değiştir</h4>
            <div className="form-group">
                <label className="form-label">Mevcut Şifre</label>
                <input type="password" className="form-input" />
            </div>
            <div className="form-group">
                <label className="form-label">Yeni Şifre</label>
                <input type="password" className="form-input" />
            </div>
            <div className="form-group">
                <label className="form-label">Yeni Şifre (Tekrar)</label>
                <input type="password" className="form-input" />
            </div>
            <button className="btn btn-primary" onClick={() => alert('Şifreniz başarıyla güncellendi.')}>Şifreyi Güncelle</button>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>İki Faktörlü Doğrulama</h4>
            <p style={{ color: 'var(--gray-400)', marginBottom: '1rem' }}>
                Hesabınızı daha güvenli hale getirmek için iki faktörlü doğrulamayı etkinleştirin.
            </p>
            <button className="btn btn-secondary">2FA'yı Etkinleştir</button>
        </div>
    </div>
);

const AppearanceSettings: React.FC = () => (
    <div>
        <h3 style={{ marginBottom: '1.5rem' }}>Görünüm Ayarları</h3>

        <div className="form-group">
            <label className="form-label">Tema</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary">🌙 Koyu</button>
                <button className="btn btn-secondary">☀️ Açık</button>
                <button className="btn btn-secondary">🖥️ Sistem</button>
            </div>
        </div>

        <div className="form-group">
            <label className="form-label">Dil</label>
            <select className="form-select" defaultValue="tr">
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
            </select>
        </div>

        <div className="form-group">
            <label className="form-label">Tarih Formatı</label>
            <select className="form-select" defaultValue="dd.mm.yyyy">
                <option value="dd.mm.yyyy">GG.AA.YYYY</option>
                <option value="mm/dd/yyyy">AA/GG/YYYY</option>
                <option value="yyyy-mm-dd">YYYY-AA-GG</option>
            </select>
        </div>

        <div className="form-group">
            <label className="form-label">Para Birimi</label>
            <select className="form-select" defaultValue="TRY">
                <option value="TRY">Türk Lirası (₺)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
            </select>
        </div>
    </div>
);

const IntegrationSettings: React.FC = () => (
    <div>
        <h3 style={{ marginBottom: '1.5rem' }}>Entegrasyonlar</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <IntegrationCard
                name="Trendyol"
                description="Trendyol pazaryeri entegrasyonu"
                connected={true}
                color="#F27A1A"
            />
            <IntegrationCard
                name="Hepsiburada"
                description="Hepsiburada pazaryeri entegrasyonu"
                connected={true}
                color="#FF6000"
            />
            <IntegrationCard
                name="N11"
                description="N11 pazaryeri entegrasyonu"
                connected={false}
                color="#7D2181"
            />
            <IntegrationCard
                name="Aras Kargo"
                description="Aras Kargo entegrasyonu"
                connected={true}
                color="#E74C3C"
            />
            <IntegrationCard
                name="Horoz Lojistik"
                description="Horoz Lojistik kargo entegrasyonu"
                connected={true}
                color="#3498DB"
            />
            <div className="card" style={{ marginTop: '1rem', borderLeft: '3px solid #27AE60' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(39, 174, 96, 0.1)', borderRadius: 'var(--radius)', color: '#27AE60' }}>
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: 'var(--gray-200)' }}>Excel Veri Senkronizasyonu</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>ÜRÜNLER MALİYET FİYAT.xlsx</div>
                        </div>
                    </div>
                    <span className="badge badge-success">Sistem Güncel</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', marginBottom: '1rem' }}>
                    Excel dosyasında yaptığınız değişiklikleri uygulamaya yansıtmak için terminalde aşağıdaki komutu çalıştırın:
                </p>
                <code style={{
                    display: 'block',
                    padding: '0.75rem',
                    background: 'var(--dark-bg)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--primary-300)',
                    border: '1px solid var(--dark-border)'
                }}>
                    python sync_excel_to_app.py
                </code>
            </div>
        </div>
    </div>
);

const IntegrationCard: React.FC<{ name: string; description: string; connected: boolean; color: string }> = ({
    name, description, connected, color
}) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        background: 'var(--dark-surface-2)',
        borderRadius: 'var(--radius)',
        borderLeft: `3px solid ${color}`
    }}>
        <div>
            <div style={{ fontWeight: 500, color: 'var(--gray-200)' }}>{name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{description}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={`badge ${connected ? 'badge-success' : 'badge-error'}`}>
                {connected ? 'Bağlı' : 'Bağlı Değil'}
            </span>
            <button className="btn btn-secondary btn-sm">
                {connected ? 'Ayarlar' : 'Bağlan'}
            </button>
        </div>
    </div>
);

export default SettingsPage;
