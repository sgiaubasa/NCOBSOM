import React, { useState, useEffect } from 'react';

// --- MOCK DATA PARA LA GALERÍA ---
const mockDocumentos = [
  { id: '1', codigo: 'DOC-001', nombre: 'Procedimiento SGI', revision: '01', fecha: '2025-01-10', enlace: '#' },
  { id: '2', codigo: 'DOC-002', nombre: 'Manual de Calidad', revision: '03', fecha: '2025-02-15', enlace: '#' }
];

function InformacionDocumentadaView() {
  const [currentView, setCurrentView] = useState('gallery'); // 'form' o 'gallery'
  const [documentos, setDocumentos] = useState(mockDocumentos);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Próximamente: URLs de Power Automate
  const API_GET_URL = '/api/get-info-doc';

  // Efecto para cargar los datos cuando exista el flujo
  useEffect(() => {
    // Aquí implementaremos el fetch cuando el usuario nos pase la URL
    console.log("Cargando Información Documentada...");
  }, []);

  const filteredDocs = documentos.filter(doc => 
    doc.codigo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {currentView === 'gallery' ? (
        <div className="glass-card gallery-container">
          <div className="gallery-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 style={{ color: 'var(--aubasa-dark)', margin: 0 }}>Información Documentada</h2>
               <button 
                  className="submit-btn" 
                  style={{ width: 'auto', padding: '0.6rem 1.5rem', margin: 0, fontSize: '0.9rem', background: 'var(--aubasa-accent)' }}
                  onClick={() => setCurrentView('form')}
               >
                 ➕ Nuevo Documento
               </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Buscar por Código o Nombre..." 
                className="glass-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: '1 1 300px' }}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Código N°</th>
                  <th>Nombre del Documento</th>
                  <th>Revisión</th>
                  <th>Fecha</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(doc => (
                  <tr key={doc.id}>
                    <td style={{fontWeight: 'bold'}}>{doc.codigo}</td>
                    <td>{doc.nombre}</td>
                    <td>{doc.revision}</td>
                    <td>{doc.fecha}</td>
                    <td className="action-buttons-cell">
                      <a href={doc.enlace} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <button className="action-btn-view">👁️ Abrir</button>
                      </a>
                    </td>
                  </tr>
                ))}
                {filteredDocs.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No se encontraron documentos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        <div className="content-grid">
          <div className="glass-card">
            <h2 style={{ color: 'var(--aubasa-dark)', marginBottom: '1.5rem' }}>Nuevo Documento</h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
              Aquí implementaremos el formulario para cargar o modificar la Información Documentada cuando conectemos Power Automate.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" className="submit-btn" style={{ background: '#666' }} onClick={() => setCurrentView('gallery')}>Volver a la Galería</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InformacionDocumentadaView;
