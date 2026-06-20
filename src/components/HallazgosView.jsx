import React, { useState } from 'react';

// --- MOCK DATA PARA LA GALERÍA ---
const mockReportes = [
  { id: 'CARGANDO...', tipoParte: 'Conectando con SharePoint...', numero: '', fecha: '', sector: [], estado: 'Cargando' }
];

const SECTORES = [
  "Gerencia de Operaciones",
  "Gerencia de Comercial",
  "Asistencia Vial",
  "Centro de Monitoreo",
  "Seguridad Patrimonial",
  "Gerencia de Sistemas",
  "Gerencia de Mantenimiento",
  "Gerencia de Asuntos Legales",
  "Gerencia de Recursos Humanos",
  "Gerencia de Compras",
  "Gerencia de Operaciones-SVIA",
  "Gerencia de Comercial-SVIA",
  "Seguridad e Higiene",
  "SGI",
  "Relaciones Institucionales"
];

function HallazgosView() {
  const [currentView, setCurrentView] = useState('gallery'); // 'form' o 'gallery'
  
  // URLs de Power Automate
  const API_POST_URL = 'https://default9444ead097714ed8a608802faff70d.4f.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/41d53fc9baf84d81a8596b505fe80702/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=vk2dHFgmvS2lQ3yVa95gRpWg9cIdF9b7Y1qId4t48H0';
  const API_GET_URL = '/api/get-reportes'; 
  const API_UPDATE_URL = 'https://default9444ead097714ed8a608802faff70d.4f.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/306d6a170eb949fdb3e1ac3a4e037e70/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=57Qe4lSjSGS-cZZ63E61FrUign6HYzaM2veFOPJeQzc';

  // Estado de los datos de la Galería
  const [reportes, setReportes] = useState(mockReportes);

  // Cargar datos reales
  React.useEffect(() => {
    if (API_GET_URL) {
      fetch(API_GET_URL)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP status ${res.status}`);
          return res.json();
        })
        .then(data => {
          const itemsArray = Array.isArray(data) ? data : data.value;
          if (itemsArray) {
            const mappedData = itemsArray.map(item => ({
              sharepointId: item.ID,
              id: item.ID_x0020_tipo || item.Title || `ID-${item.ID}`,
              tipoParte: (item.TipoParte?.Value || '').includes('No Conformidad') ? 'No Conformidad' : 
                         ((item.TipoParte?.Value || '').includes('Observacion') ? 'Observacion' : (item.TipoParte?.Value || '')),
              numero: item.Numero || item.numero || item.N_x00b0_ || '',
              fecha: item.FechadeDeteccion ? item.FechadeDeteccion.split('T')[0] : (item.Created ? item.Created.split('T')[0] : ''),
              fechaDeteccion: item.FechadeDeteccion || (item.Created ? item.Created.split('T')[0] : ''),
              sector: Array.isArray(item.Sector) ? item.Sector.map(s => s.Value) : (item.Sector?.Value ? [item.Sector.Value] : []),
              origen: item.Origen?.Value || '',
              detectadoPor: item.DetectadoPor?.Value || '',
              seccionDescripcion: item.SeccionI_Descripcion || '',
              seccionAccionInmediata: item.SeccionII_AccionInmediata || '',
              fechaAccionInmediata: item.FechaDeAccionInmediata ? item.FechaDeAccionInmediata.split('T')[0] : '',
              responsableAccionInmediata: item.ResponsableAccionInmediata || '',
              seccionAnalisisCausa: item.SeccionIII_AnalisisCausa || '',
              seccionAccionCorrectiva: item.SeccionIVaccioncorrectiva_x002f_ || item['Seccion IV accion correctiva /accion de mejora a ejecutar'] || '',
              fechaPlanificadaImplementacion: item.FechaPlanificadaImplementacion || '',
              responsableImplementacion: item.ResponsableImplementacion || '',
              seccionVerificacionAcciones: item.SeccionV_VerificacionAcciones || '',
              fechaVerificacion: item.FechaVerificacion ? item.FechaVerificacion.split('T')[0] : '',
              responsableVerificacion: item.ResponsableVerificacion_Evaluacion_Eficacia?.Value || item.ResponsableVerificacion_Evaluacion_Eficacia || '',
              seccionEvaluacionEficacia: item.SeccionVI_EvaluacionEficacia || '',
              fechaEvaluacionEficacia: item.FechaEvaluacionEficacia ? item.FechaEvaluacionEficacia.split('T')[0] : '',
              estado: (!item.Estado?.Value || item.Estado?.Value === 'Abierta') ? 'Sin Avance' : item.Estado?.Value,
              tieneAdjunto: item['{HasAttachments}'] || false
            }));
            setReportes(mappedData);
          } else {
             throw new Error("Formato de datos no reconocido");
          }
        })
        .catch(err => {
          console.error("Error cargando datos de SharePoint:", err);
          setReportes([{
             id: 'ERROR-CORS',
             tipoParte: 'Falta Permiso en Power Automate',
             sector: 'Ver Consola F12',
             estado: 'Error',
             fecha: 'Hoy'
          }]);
        });
    }
  }, []);

  const [formData, setFormData] = useState({
    sharepointId: null, idTipo: '', tipoParte: '', numero: '', fechaDeteccion: '', sector: [],
    origen: '', detectadoPor: '', estado: '', archivosAdjuntos: null,
    seccionDescripcion: '', seccionAccionInmediata: '', fechaAccionInmediata: '', responsableAccionInmediata: '',
    seccionAnalisisCausa: '', seccionAccionCorrectiva: '', fechaPlanificadaImplementacion: '', responsableImplementacion: '',
    seccionVerificacionAcciones: '', fechaVerificacion: '', responsableVerificacion: '',
    seccionEvaluacionEficacia: '', fechaEvaluacionEficacia: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [origenFilter, setOrigenFilter] = useState('Todos');
  const [sectorFilter, setSectorFilter] = useState('Todos');
  const [isReadOnly, setIsReadOnly] = useState(false);

  React.useEffect(() => {
    if (!formData.sharepointId && formData.tipoParte) {
      const sameType = reportes.filter(r => r.tipoParte === formData.tipoParte);
      let maxNum = 0;
      sameType.forEach(r => {
        let n = parseFloat(r.numero);
        if (isNaN(n) && r.id) {
          const match = r.id.match(/\d+$/);
          if (match) n = parseInt(match[0], 10);
        }
        if (!isNaN(n) && n > maxNum) maxNum = n;
      });
      const nextNum = maxNum + 1;
      
      setFormData(prev => ({
        ...prev,
        numero: nextNum,
        idTipo: `${prev.tipoParte}-${nextNum}`
      }));
    }
  }, [formData.tipoParte, formData.sharepointId, reportes]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { archivosAdjuntos, ...dataToSend } = formData;
    
    dataToSend.sector = dataToSend.sector.map(s => ({ "Value": s }));
    
    if (dataToSend.numero !== null && dataToSend.numero !== undefined && dataToSend.numero !== '') {
      const parsedNum = parseInt(dataToSend.numero, 10);
      if (!isNaN(parsedNum)) dataToSend.numero = parsedNum;
      else delete dataToSend.numero;
    } else delete dataToSend.numero;

    if (dataToSend.sharepointId === null || dataToSend.sharepointId === undefined || dataToSend.sharepointId === '') {
      delete dataToSend.sharepointId;
    }

    const dateFields = ['fechaDeteccion', 'fechaAccionInmediata', 'fechaVerificacion', 'fechaEvaluacionEficacia'];
    dateFields.forEach(field => {
      if (dataToSend[field] === '') delete dataToSend[field];
    });
    
    try {
      let targetUrl = dataToSend.sharepointId && API_UPDATE_URL !== '' ? API_UPDATE_URL : API_POST_URL;

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok || response.status === 202) {
        alert('¡Registro enviado con éxito a SharePoint!');
        setCurrentView('gallery');
      } else {
        const errorText = await response.text();
        alert(`Hubo un error al comunicarse con Power Automate.\nCódigo: ${response.status}\nDetalle: ${errorText}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión. Verifica tu internet.');
    }
  };

  const handleEdit = (item) => {
    setIsReadOnly(false);
    setFormData({
      sharepointId: item.sharepointId, idTipo: item.id, tipoParte: item.tipoParte, numero: item.numero,
      sector: item.sector, estado: item.estado, fechaDeteccion: item.fechaDeteccion, origen: item.origen,
      detectadoPor: item.detectadoPor, seccionDescripcion: item.seccionDescripcion,
      seccionAccionInmediata: item.seccionAccionInmediata, fechaAccionInmediata: item.fechaAccionInmediata,
      responsableAccionInmediata: item.responsableAccionInmediata, seccionAnalisisCausa: item.seccionAnalisisCausa,
      seccionAccionCorrectiva: item.seccionAccionCorrectiva, fechaPlanificadaImplementacion: item.fechaPlanificadaImplementacion,
      responsableImplementacion: item.responsableImplementacion, seccionVerificacionAcciones: item.seccionVerificacionAcciones,
      fechaVerificacion: item.fechaVerificacion, responsableVerificacion: item.responsableVerificacion,
      seccionEvaluacionEficacia: item.seccionEvaluacionEficacia, fechaEvaluacionEficacia: item.fechaEvaluacionEficacia
    });
    setCurrentView('form');
  };

  const handleView = (item) => {
    handleEdit(item);
    setIsReadOnly(true);
  };

  const filteredReportes = reportes.filter(r => {
    const sectorStr = Array.isArray(r.sector) ? r.sector.join(', ') : r.sector;
    const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sectorStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || r.estado === statusFilter;
    const matchesTipo = tipoFilter === 'Todos' || r.tipoParte === tipoFilter;
    const matchesOrigen = origenFilter === 'Todos' || r.origen === origenFilter;
    
    let matchesSector = sectorFilter === 'Todos';
    if (sectorFilter !== 'Todos') {
      matchesSector = Array.isArray(r.sector) ? r.sector.includes(sectorFilter) : r.sector === sectorFilter;
    }

    return matchesSearch && matchesStatus && matchesTipo && matchesOrigen && matchesSector;
  });

  return (
    <>
      {currentView === 'gallery' ? (
        <div className="glass-card gallery-container">
          <div className="gallery-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Fila superior: Título y botón Nuevo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 style={{ color: 'var(--aubasa-dark)', margin: 0 }}>Mis Hallazgos</h2>
               <button 
                  className="submit-btn" 
                  style={{ width: 'auto', padding: '0.6rem 1.5rem', margin: 0, fontSize: '0.9rem' }}
                  onClick={() => {
                    setIsReadOnly(false);
                    setFormData({
                      sharepointId: null, idTipo: '', tipoParte: '', numero: '', fechaDeteccion: '', sector: [], origen: '', detectadoPor: '', estado: '', archivosAdjuntos: null,
                      seccionDescripcion: '', seccionAccionInmediata: '', fechaAccionInmediata: '', responsableAccionInmediata: '',
                      seccionAnalisisCausa: '', seccionAccionCorrectiva: '', fechaPlanificadaImplementacion: '', responsableImplementacion: '',
                      seccionVerificacionAcciones: '', fechaVerificacion: '', responsableVerificacion: '', seccionEvaluacionEficacia: '', fechaEvaluacionEficacia: ''
                    });
                    setCurrentView('form');
                  }}
               >
                 ➕ Nuevo Hallazgo
               </button>
            </div>

            {/* Fila de filtros */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Buscar por ID o Sector..." 
                className="glass-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: '1 1 200px' }}
              />
              <select className="glass-input" style={{ flex: '1 1 150px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="Todos">Estado: Todos</option>
                <option value="Sin Avance">Sin Avance</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Cerrada">Cerrada</option>
              </select>
              <select className="glass-input" style={{ flex: '1 1 150px' }} value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
                <option value="Todos">Tipo: Todos</option>
                <option value="No Conformidad">No Conformidad</option>
                <option value="Observacion">Observación</option>
                <option value="Oportunidad de Mejora">Oportunidad de Mejora</option>
              </select>
              <select className="glass-input" style={{ flex: '1 1 150px' }} value={origenFilter} onChange={(e) => setOrigenFilter(e.target.value)}>
                <option value="Todos">Origen: Todos</option>
                <option value="Auditoría interna">Auditoría interna</option>
                <option value="Auditoría externa">Auditoría externa</option>
                <option value="Reclamo">Reclamo</option>
                <option value="Incidente">Incidente</option>
                <option value="Otro">Otro</option>
              </select>
              <select className="glass-input" style={{ flex: '1 1 150px' }} value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
                <option value="Todos">Sector: Todos</option>
                {SECTORES.map(sec => <option key={sec} value={sec}>{sec}</option>)}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>ID Reporte</th>
                  <th>Tipo</th>
                  <th>SECTOR</th>
                  <th>FECHA</th>
                  <th>ESTADO</th>
                  <th>ADJUNTO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredReportes.map(reporte => (
                  <tr key={reporte.id}>
                    <td style={{fontWeight: 'bold'}}>{reporte.id}</td>
                    <td>{reporte.tipoParte}</td>
                    <td>{Array.isArray(reporte.sector) ? reporte.sector.join(', ') : reporte.sector}</td>
                    <td>{reporte.fecha}</td>
                    <td>
                      <span className={`status-badge ${reporte.estado === 'Cerrada' ? 'status-closed' : 'status-open'}`}>
                        {reporte.estado}
                      </span>
                    </td>
                    <td style={{textAlign: 'center', fontSize: '1.2rem'}}>
                      {reporte.tieneAdjunto ? '📎' : '-'}
                    </td>
                    <td className="action-buttons-cell">
                      <button className="action-btn-view" onClick={() => handleView(reporte)}>👁️ Ver</button>
                      <button className="action-btn-edit" onClick={() => handleEdit(reporte)}>✏️ Modificar</button>
                    </td>
                  </tr>
                ))}
                {filteredReportes.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No se encontraron coincidencias.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        <div className="content-grid">
          <div className="glass-card">
            <form onSubmit={handleSubmit}>
              <fieldset disabled={isReadOnly} className="form-grid" style={{ border: 'none', padding: 0, margin: 0 }}>
                <div className="form-group">
                <label className="form-label">ID Tipo</label>
                <input type="text" name="idTipo" className="glass-input" placeholder="Ej: No Conformidad Mayor-3" value={formData.idTipo} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de Parte</label>
                <select name="tipoParte" className="glass-input" value={formData.tipoParte} onChange={handleChange} required>
                  <option value="">Seleccione un tipo...</option>
                  <option value="No Conformidad">No Conformidad</option>
                  <option value="Observacion">Observación</option>
                  <option value="Oportunidad de Mejora">Oportunidad de Mejora</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Número</label>
                <input type="number" name="numero" className="glass-input" value={formData.numero} onChange={handleChange} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de Detección</label>
                <input type="date" name="fechaDeteccion" className="glass-input" value={formData.fechaDeteccion} onChange={handleChange} required/>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Sectores Involucrados</label>
                <div className="sector-pills-container">
                  {SECTORES.map(sec => {
                    const isActive = formData.sector.includes(sec);
                    return (
                      <div 
                        key={sec} 
                        className={`sector-pill ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          if (isReadOnly) return;
                          setFormData(prev => {
                            const newSectores = isActive 
                              ? prev.sector.filter(s => s !== sec) 
                              : [...prev.sector, sec];
                            return { ...prev, sector: newSectores };
                          });
                        }}
                      >
                        {sec}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Origen</label>
                <select name="origen" className="glass-input" value={formData.origen} onChange={handleChange} required>
                  <option value="">Seleccione el origen...</option>
                  <option value="Auditoría interna">Auditoría interna</option>
                  <option value="Auditoría externa">Auditoría externa</option>
                  <option value="Reclamo">Reclamo</option>
                  <option value="Incidente">Incidente</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Detectado Por</label>
                <select name="detectadoPor" className="glass-input" value={formData.detectadoPor} onChange={handleChange} required>
                  <option value="">Seleccione quién lo detectó...</option>
                  <option value="SGI">SGI</option>
                  <option value="IRAM">IRAM</option>
                </select>
              </div>
              <div className="form-group full-width" style={{marginTop: '1.5rem'}}>
                <h3 style={{color: 'var(--aubasa-dark)', borderBottom: '2px solid var(--aubasa-blue)', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Sección I: Descripción de Hallazgos</h3>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Descripción</label>
                <textarea name="seccionDescripcion" className="glass-input" value={formData.seccionDescripcion} onChange={handleChange} required/>
              </div>

              <div className="form-group full-width" style={{marginTop: '1.5rem'}}>
                <h3 style={{color: 'var(--aubasa-dark)', borderBottom: '2px solid var(--aubasa-blue)', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Sección II: Acción Inmediata</h3>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Descripción Acción Inmediata</label>
                <textarea name="seccionAccionInmediata" className="glass-input" value={formData.seccionAccionInmediata} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de Acción Inmediata</label>
                <input type="date" name="fechaAccionInmediata" className="glass-input" value={formData.fechaAccionInmediata} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label className="form-label">Responsable Acción Inmediata</label>
                <input type="text" name="responsableAccionInmediata" className="glass-input" value={formData.responsableAccionInmediata} onChange={handleChange}/>
              </div>

              <div className="form-group full-width" style={{marginTop: '1.5rem'}}>
                <h3 style={{color: 'var(--aubasa-dark)', borderBottom: '2px solid var(--aubasa-blue)', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Sección III: Análisis de Causa</h3>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Análisis de Causa</label>
                <textarea name="seccionAnalisisCausa" className="glass-input" value={formData.seccionAnalisisCausa} onChange={handleChange}/>
              </div>

              <div className="form-group full-width" style={{marginTop: '1.5rem'}}>
                <h3 style={{color: 'var(--aubasa-dark)', borderBottom: '2px solid var(--aubasa-blue)', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Sección IV: Acción Correctiva / Mejora a Ejecutar</h3>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Acción Correctiva</label>
                <textarea name="seccionAccionCorrectiva" className="glass-input" value={formData.seccionAccionCorrectiva} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha Planificada Implementación</label>
                <input type="text" name="fechaPlanificadaImplementacion" className="glass-input" value={formData.fechaPlanificadaImplementacion} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label className="form-label">Responsable Implementación</label>
                <input type="text" name="responsableImplementacion" className="glass-input" value={formData.responsableImplementacion} onChange={handleChange}/>
              </div>

              <div className="form-group full-width" style={{marginTop: '1.5rem'}}>
                <h3 style={{color: 'var(--aubasa-dark)', borderBottom: '2px solid var(--aubasa-blue)', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Sección V: Verificación de Acciones</h3>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Verificación de Acciones</label>
                <textarea name="seccionVerificacionAcciones" className="glass-input" value={formData.seccionVerificacionAcciones} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha Verificación</label>
                <input type="date" name="fechaVerificacion" className="glass-input" value={formData.fechaVerificacion} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label className="form-label">Responsable Verificación</label>
                <select name="responsableVerificacion" className="glass-input" value={formData.responsableVerificacion} onChange={handleChange}>
                  <option value="">Seleccione...</option>
                  <option value="SGI">SGI</option>
                </select>
              </div>

              <div className="form-group full-width" style={{marginTop: '1.5rem'}}>
                <h3 style={{color: 'var(--aubasa-dark)', borderBottom: '2px solid var(--aubasa-blue)', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Sección VI: Evaluación de Eficacia</h3>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Evaluación de Eficacia</label>
                <textarea name="seccionEvaluacionEficacia" className="glass-input" value={formData.seccionEvaluacionEficacia} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha Ev. Eficacia</label>
                <input type="date" name="fechaEvaluacionEficacia" className="glass-input" value={formData.fechaEvaluacionEficacia} onChange={handleChange}/>
              </div>

              <div className="form-group full-width" style={{marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem'}}>
                <label className="form-label">Estado</label>
                <select name="estado" className="glass-input" value={formData.estado} onChange={handleChange} required>
                  <option value="">Seleccione el estado...</option>
                  <option value="Sin Avance">Sin Avance</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cerrada">Cerrada</option>
                </select>
              </div>
              </fieldset>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                {!isReadOnly && <button type="submit" className="submit-btn">Guardar Registro</button>}
                <button type="button" className="submit-btn" style={{ background: '#666' }} onClick={() => setCurrentView('gallery')}>Volver a la Galería</button>
              </div>
            </form>
          </div>

          {/* INFO PANEL */}
          <div className="info-panel">
            <div className="info-card">
              <h3>Instrucciones</h3>
              <p>Complete los campos obligatorios para registrar la No Conformidad.</p>
            </div>
            <div className="info-card">
              <h3>Datos Adjuntos</h3>
              <div className="file-upload-wrapper">
                <input type="file" name="archivosAdjuntos" id="file-upload" style={{ display: 'none' }} onChange={handleChange} disabled={isReadOnly} />
                <label htmlFor="file-upload" style={{ cursor: isReadOnly ? 'default' : 'pointer', color: 'var(--aubasa-dark)', fontWeight: '600' }}>
                  {formData.archivosAdjuntos ? formData.archivosAdjuntos.name : 'Subir evidencia (PDF/JPG)'}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HallazgosView;
