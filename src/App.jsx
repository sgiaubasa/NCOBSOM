import React, { useState, useEffect } from 'react';
import './App.css';
import HallazgosView from './components/HallazgosView';
import InformacionDocumentadaView from './components/InformacionDocumentadaView';
import netlifyIdentity from 'netlify-identity-widget';
import { hasAccess } from './config/roles';

function App() {
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState(null); 
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Inicializar Netlify Identity
    netlifyIdentity.init();

    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      setUser(currentUser);
      setDefaultModule(currentUser.email);
    }
    setAuthChecked(true);

    // Escuchar eventos de login/logout
    netlifyIdentity.on('login', (u) => {
      setUser(u);
      setDefaultModule(u.email);
      netlifyIdentity.close();
    });

    netlifyIdentity.on('logout', () => {
      setUser(null);
      setActiveModule(null);
    });

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  const setDefaultModule = (email) => {
    if (hasAccess(email, 'hallazgos')) {
      setActiveModule('hallazgos');
    } else if (hasAccess(email, 'infodoc')) {
      setActiveModule('infodoc');
    } else {
      setActiveModule(null);
    }
  };

  const handleLogin = () => {
    netlifyIdentity.open();
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
  };

  if (!authChecked) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;

  if (!user) {
    return (
      <div className="dashboard-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-gradient)' }}>
        <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <div className="sidebar-logo" style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--aubasa-dark)', fontSize: '2rem' }}>AUBASA</h2>
            <p style={{ color: 'var(--aubasa-blue)' }}>SISTEMA DE GESTIÓN INTEGRAL</p>
          </div>
          <p style={{ marginBottom: '2rem', color: 'var(--text-dark)' }}>Por favor, inicie sesión para acceder al sistema.</p>
          <button className="submit-btn" style={{ width: '100%' }} onClick={handleLogin}>
            Iniciar Sesión / Registrarse
          </button>
        </div>
      </div>
    );
  }

  const userEmail = user.email;
  const canViewHallazgos = hasAccess(userEmail, 'hallazgos');
  const canViewInfoDoc = hasAccess(userEmail, 'infodoc');
  const hasNoAccess = !canViewHallazgos && !canViewInfoDoc;

  // Extraer iniciales y nombre del correo o del metadata
  const userName = user.user_metadata?.full_name || userEmail.split('@')[0];
  const initials = userName.substring(0, 2).toUpperCase();

  return (
    <div className="dashboard-layout">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>AUBASA</h2>
          <p>AUTOPISTAS DE BUENOS AIRES S.A.</p>
        </div>
        
        <nav className="nav-menu">
          {canViewHallazgos && (
            <div 
              className={`nav-item ${activeModule === 'hallazgos' ? 'active' : ''}`}
              onClick={() => setActiveModule('hallazgos')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              Mis Hallazgos
            </div>
          )}
          
          {canViewInfoDoc && (
            <div 
              className={`nav-item ${activeModule === 'infodoc' ? 'active' : ''}`}
              onClick={() => setActiveModule('infodoc')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Inf. Documentada
            </div>
          )}
        </nav>
      </aside>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="main-content">
        
        <header className="top-bar">
          <h1>
            {activeModule === 'hallazgos' ? 'Gestión de Hallazgos' : 
             activeModule === 'infodoc' ? 'Información Documentada' : 'Bienvenido'}
          </h1>
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '600' }}>{userName}</span>
            <div className="avatar">{initials}</div>
            <button onClick={handleLogout} className="cancel-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginLeft: '0.5rem' }}>Salir</button>
          </div>
        </header>

        {hasNoAccess ? (
          <div className="glass-card" style={{ marginTop: '2rem', textAlign: 'center' }}>
            <h3>Sin Acceso</h3>
            <p>Tu cuenta ({userEmail}) no tiene permisos asignados para ningún módulo.</p>
            <p>Por favor, contacta al administrador.</p>
          </div>
        ) : (
          <>
            {activeModule === 'hallazgos' && canViewHallazgos && <HallazgosView currentUserEmail={userEmail} />}
            {activeModule === 'infodoc' && canViewInfoDoc && <InformacionDocumentadaView currentUserEmail={userEmail} />}
          </>
        )}

      </main>
    </div>
  );
}

export default App;
