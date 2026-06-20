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
  
  const API_GET_URL = '/api/get-info-doc';
  const API_POST_URL = '/api/post-info-doc';
  const API_UPDATE_URL = '/api/update-info-doc';
  
  const [formData, setFormData] = useState({});
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Efecto para cargar los datos cuando exista el flujo
  useEffect(() => {
    fetch(API_GET_URL)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
        return res.json();
      })
      .then(data => {
        const itemsArray = Array.isArray(data) ? data : data.value;
        if (itemsArray) {
          const mappedDocs = itemsArray.map(item => ({
            sharepointId: item.ID,
            id: item.ID,
            codigoCompleto: item.Codigo_x0020_N_x00b0_ || `${item.Codigo?.Value || ''}${item.Documento?.Value || ''}${item.N_x00fa_mero || item.N_x00b0_ || ''}`,
            codigo: item.Codigo?.Value || '',
            numeroCodigo: item.N_x00b0_ || '',
            documento: item.Documento?.Value || '',
            numeroDocumento: item.N_x00fa_mero || item.Número || '',
            nombre: item.Nombre || '',
            revision: item.Revision || '',
            fecha: item.Fecha ? item.Fecha.split('T')[0] : (item.Created ? item.Created.split('T')[0] : ''),
            enlace: item['{Link}'] || item['{Path}'] || '#'
          }));
          setDocumentos(mappedDocs);
        }
      })
      .catch(err => {
        console.error("Error cargando documentos:", err);
      });
  }, []);

  const handleEdit = (doc) => {
    setIsReadOnly(false);
    setFormData({
      sharepointId: doc.sharepointId,
      codigo: doc.codigo,
      numeroCodigo: doc.numeroCodigo,
      documento: doc.documento,
      numeroDocumento: doc.numeroDocumento,
      nombre: doc.nombre,
      revision: doc.revision,
      fecha: doc.fecha
    });
    setCurrentView('form');
  };

  const handleView = (doc) => {
    handleEdit(doc);
    setIsReadOnly(true);
  };

  const handleNew = () => {
    setIsReadOnly(false);
    setFormData({});
    setCurrentView('form');
  };

  const filteredDocs = documentos.filter(doc => 
    (doc.codigoCompleto || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (doc.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {currentView === 'gallery' ? (
        <div className="glass-card gallery-container">
          <div className="gallery-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
               <h2 style={{ color: 'var(--aubasa-dark)', margin: 0 }}>Información Documentada</h2>
               <button 
                  className="submit-btn" 
                  style={{ 
                    width: 'auto', 
                    padding: '0.8rem 2rem', 
                    margin: 0, 
                    fontSize: '1rem', 
                    fontWeight: 'bold',
                    background: 'var(--aubasa-accent)',
                    boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)',
                    transform: 'translateY(-2px)'
                  }}
                  onClick={handleNew}
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
                style={{ width: '300px', flex: '0 0 auto' }}
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
                    <td style={{fontWeight: 'bold'}}>{doc.codigoCompleto}</td>
                    <td>{doc.nombre}</td>
                    <td>{doc.revision}</td>
                    <td>{doc.fecha}</td>
                    <td className="action-buttons-cell" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button className="action-btn-view" onClick={() => handleView(doc)}>👁️ Ver</button>
                      <button className="action-btn-edit" onClick={() => handleEdit(doc)}>✏️ Modificar</button>
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

        <div className="glass-card">
          <h2 style={{ color: 'var(--aubasa-dark)', marginBottom: '1.5rem', borderBottom: '2px solid var(--aubasa-blue)', paddingBottom: '0.5rem' }}>
              {isReadOnly ? 'Ver Documento' : (formData.sharepointId ? 'Modificar Documento' : 'Nuevo Documento')}
            </h2>
            <form onSubmit={async (e) => { 
              e.preventDefault(); 
              if (isReadOnly) return;
              const formEl = e.target;
              const dataToSend = Object.fromEntries(new FormData(formEl).entries());
              if (formData.sharepointId) {
                dataToSend.sharepointId = formData.sharepointId;
              }
              
              try {
                // Determine URL (POST vs UPDATE)
                let targetUrl = dataToSend.sharepointId && API_UPDATE_URL !== '' ? API_UPDATE_URL : API_POST_URL;
                
                const response = await fetch(targetUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(dataToSend)
                });
          
                if (response.ok || response.status === 202) {
                  alert('¡Documento guardado con éxito!');
                  setCurrentView('gallery');
                  // Ideally trigger a re-fetch here, but a reload or manual refresh works for now.
                } else {
                  const errorText = await response.text();
                  alert(`Hubo un error al guardar.\nCódigo: ${response.status}\nDetalle: ${errorText}`);
                }
              } catch (error) {
                console.error('Error de red:', error);
                alert('Error de conexión. Verifica tu internet.');
              }
            }}>
              <fieldset className="form-grid" disabled={isReadOnly} style={{ border: 'none', padding: 0, margin: 0 }}>
                
                <div className="form-group">
                  <label className="form-label">Código</label>
                  <select name="codigo" className="glass-input" required defaultValue={formData.codigo || ''}>
                    <option value="">Seleccione el código...</option>
                    <option value="PAU/">PAU/</option>
                    <option value="MG/">MG/</option>
                    <option value="SC ME P001">SC ME P001</option>
                    <option value="ITAU/">ITAU/</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">N° de Código</label>
                  <input type="number" name="numeroCodigo" className="glass-input" required placeholder="Ej: 001" defaultValue={formData.numeroCodigo || ''} />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de Documento</label>
                  <select name="documento" className="glass-input" required defaultValue={formData.documento || ''}>
                    <option value="">Seleccione...</option>
                    <option value="Anexo">Anexo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Número de Documento</label>
                  <input type="number" name="numeroDocumento" className="glass-input" required placeholder="Ej: 1" defaultValue={formData.numeroDocumento || ''} />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Nombre del Documento</label>
                  <input type="text" name="nombre" className="glass-input" required placeholder="Ej: Procedimiento de Auditorías Internas" defaultValue={formData.nombre || ''} />
                </div>

                <div className="form-group">
                  <label className="form-label">Revisión</label>
                  <input type="text" name="revision" className="glass-input" required placeholder="Ej: 01" defaultValue={formData.revision || ''} />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input type="date" name="fecha" className="glass-input" required defaultValue={formData.fecha || ''} />
                </div>

              </fieldset>

              <div className="form-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="submit-btn" style={{ background: '#666' }} onClick={() => setCurrentView('gallery')}>
                  {isReadOnly ? 'Volver' : 'Cancelar'}
                </button>
                {!isReadOnly && (
                  <button type="submit" className="submit-btn">
                    Guardar Documento
                  </button>
                )}
              </div>
            </form>
        </div>

      )}
    </>
  );
}

export default InformacionDocumentadaView;
