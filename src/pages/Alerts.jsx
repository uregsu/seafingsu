import { useState } from 'react';
import { useSeafin } from '../contexts/SeafinContext';
import { modules, month, alertStatuses, filterItems } from '../data/operations';
import { Empty, PageTitle } from '../components/SeafinUI';

function Review({ alert }) {
  const { reviews, review }=useSeafin();
  const old=reviews[alert.id];
  const [status,setStatus]=useState(old?.status || 'Identificado');
  const [note,setNote]=useState('');
  const [error,setError]=useState('');
  return <article className="panel alert-panel"><span className="badge">{old?.status || 'Identificado'}</span><h3>{alert.title}</h3><p>{modules[alert.module]} · {month(alert.competencia)}</p><p>{alert.detail}</p><p className="muted source-text">Fonte: {alert.source}</p><form onSubmit={e=>{e.preventDefault();try{review(alert.id,status,note);setNote('');setError('Análise registrada.');}catch(err){setError(err.message);}}}><div className="form-grid"><label>Situação da análise<select value={status} onChange={e=>setStatus(e.target.value)}>{alertStatuses.map(s=><option key={s}>{s}</option>)}</select></label><label>Análise / justificativa<input required value={note} onChange={e=>setNote(e.target.value)} /></label></div><button className="secondary">Registrar análise</button>{error&&<p role="status">{error}</p>}</form><p className="muted">A análise não modifica os valores originais nem apaga o alerta da fonte.</p>{old?.history && <details><summary>Histórico das análises</summary><ol className="timeline">{old.history.map((h,i)=><li key={i}>{new Date(h.at).toLocaleString('pt-BR')} · {h.status} · {h.note}</li>)}</ol></details>}</article>;
}
export default function Alerts() {
  const { alerts, filters, reviews }=useSeafin();
  const [allPeriods,setAllPeriods]=useState(false);
  const [status,setStatus]=useState('');
  const rows=filterItems(alerts.map(a=>({...a,status:a.record?.status||'Aberta'})),{...filters,period:allPeriods?'':filters.period}).filter(a=>!status||(reviews[a.id]?.status||'Identificado')===status);
  return <><PageTitle title="Alertas e divergências">Inconsistências de origem e prazos vencidos de registros operacionais.</PageTitle><div className="toolbar"><label className="checkbox-label"><input type="checkbox" checked={allPeriods} onChange={e=>setAllPeriods(e.target.checked)} />Incluir todas as competências</label><label>Situação da análise<select value={status} onChange={e=>setStatus(e.target.value)}><option value="">Todas</option>{alertStatuses.map(s=><option key={s}>{s}</option>)}</select></label></div>{!rows.length?<Empty>Nenhum alerta derivado dos dados nesta seleção. A divergência de julho pode ser consultada selecionando julho ou todas as competências.</Empty>:rows.map(a=><Review key={a.id} alert={a} />)}</>;
}
