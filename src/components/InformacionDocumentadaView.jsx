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
            <h2 style={{ color: 'var(--aubasa-dark)', marginBottom: '1.5rem', borderBottom: '2px solid var(--aubasa-blue)', paddingBottom: '0.5rem' }}>
              Nuevo Documento
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); alert("Funcionalidad pendiente de conexión con Power Automate"); }}>
              <fieldset className="form-grid" style={{ border: 'none', padding: 0, margin: 0 }}>
                
                <div className="form-group">
                  <label className="form-label">Código</label>
                  <select name="codigo" className="glass-input" required>
                    <option value="">Seleccione el código...</option>
                    <option value="SGI-PR">SGI-PR (Procedimiento)</option>
                    <option value="SGI-MA">SGI-MA (Manual)</option>
                    <option value="SGI-RG">SGI-RG (Registro)</option>
                    <option value="SGI-IN">SGI-IN (Instructivo)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">N° de Código</label>
                  <input type="number" name="numeroCodigo" className="glass-input" required placeholder="Ej: 001" />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de Documento</label>
                  <select name="documento" className="glass-input" required>
                    <option value="">Seleccione...</option>
                    <option value="Procedimiento">Procedimiento</option>
                    <option value="Manual">Manual</option>
                    <option value="Registro">Registro</option>
                    <option value="Instructivo">Instructivo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Número de Documento</label>
                  <input type="number" name="numeroDocumento" className="glass-input" required placeholder="Ej: 1" />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Nombre del Documento</label>
                  <input type="text" name="nombre" className="glass-input" required placeholder="Ej: Procedimiento de Auditorías Internas" />
                </div>

                <div className="form-group">
                  <label className="form-label">Revisión</label>
                  <input type="text" name="revision" className="glass-input" required placeholder="Ej: 01" />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input type="date" name="fecha" className="glass-input" required />
                </div>

              </fieldset>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="submit-btn">Guardar Documento</button>
                <button type="button" className="submit-btn" style={{ background: '#666' }} onClick={() => setCurrentView('gallery')}>Cancelar</button>
              </div>
            </form>
          </div>

          <div className="info-panel">
            <div className="info-card">
              <h3>Archivo del Documento</h3>
              <p>El archivo PDF o Word se adjuntará aquí.</p>
              <div className="file-upload-wrapper" style={{ marginTop: '1rem' }}>
                <input type="file" id="doc-upload" style={{ display: 'none' }} />
                <label htmlFor="doc-upload" style={{ cursor: 'pointer', color: 'var(--aubasa-dark)', fontWeight: '600' }}>
                  Subir Documento (PDF/Word)
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InformacionDocumentadaView;
