import React, { useState } from 'react';
import './App.css';
import HallazgosView from './components/HallazgosView';
import InformacionDocumentadaView from './components/InformacionDocumentadaView';

function App() {
  const [activeModule, setActiveModule] = useState('hallazgos'); // 'hallazgos' o 'infodoc'

  return (
    <div className="dashboard-layout">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>AUBASA</h2>
          <p>AUTOPISTAS DE BUENOS AIRES S.A.</p>
        </div>
        
        <nav className="nav-menu">
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
        </nav>
      </aside>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="main-content">
        
        <header className="top-bar">
          <h1>{activeModule === 'hallazgos' ? 'Gestión de Hallazgos' : 'Información Documentada'}</h1>
          <div className="user-profile">
            <span>Sergio Montes</span>
            <div className="avatar">SM</div>
          </div>
        </header>

        {activeModule === 'hallazgos' && <HallazgosView />}
        {activeModule === 'infodoc' && <InformacionDocumentadaView />}

      </main>
    </div>
  );
}

export default App;
