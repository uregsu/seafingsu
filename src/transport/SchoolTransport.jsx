import { useState } from 'react';
import { Link,useParams } from 'react-router-dom';
import { useTransport } from './TransportContext';
import { useSeafin } from '../contexts/SeafinContext';
import { Empty } from '../components/SeafinUI';
import { applies,today } from './domain';
import { contractName } from './TransportUI';
import OccurrenceForm from './OccurrenceForm';
export default function SchoolTransport(){
  const {schoolId:parameter}=useParams();const {state,actor}=useTransport();const {schools}=useSeafin();const [show,setShow]=useState(false);const [success,setSuccess]=useState('');
  const schoolId=actor.role==='school'?actor.schoolId:parameter;const school=schools.find(s=>s.id===schoolId);
  if(actor.role==='school'&&parameter&&parameter!==actor.schoolId)return <Empty>Acesso não autorizado a outra escola.</Empty>;
  if(!school){if(actor.role==='school')return <Empty>Perfil escolar sem vínculo institucional. Solicite regularização ao administrador.</Empty>;return <section className="panel"><h3>Prévia da área da escola</h3><p>Você está no perfil regional de demonstração. Selecione uma escola para conferir a experiência restrita à unidade; em produção a escola será definida pelo perfil autenticado.</p><div className="school-picker">{schools.map(s=><Link key={s.id} to={`/painel/transporte/escola/${s.id}`}>{s.name}</Link>)}</div></section>;}
  const assignments=state.assignments.filter(a=>a.schoolId===schoolId&&applies(a,today().slice(0,7)));
  const rows=state.occurrences.filter(r=>r.schoolId===schoolId).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  return <><section className="panel"><h3>TRANSPORTE ESCOLAR</h3><p>Ocorrências e acompanhamento do serviço</p><h4>{school.name}</h4><p>CIE cadastrado: {assignments[0]?.cie||school.cie||'não informado'}</p><p>Contratos vinculados: {assignments.length?assignments.map(a=>contractName(a.contractId)).join(', '):'nenhum vínculo confirmado pelo SEAFIN'}</p><div className="toolbar"><button className="primary" onClick={()=>{setShow(true);setSuccess('');}}>Registrar nova ocorrência</button><Link to={`/painel/transporte/escola/${schoolId}/avaliacoes`}>Avaliação mensal →</Link></div></section>{success&&<p role="status" className="success-box">Ocorrência registrada com sucesso. Protocolo: <strong>{success}</strong></p>}{show&&<OccurrenceForm key={schoolId} schoolId={schoolId} onDone={row=>{setShow(false);if(row)setSuccess(row.protocol);}}/>}<section className="panel"><h3>Ocorrências recentes e histórico da própria escola</h3>{!rows.length?<Empty>Nenhuma ocorrência registrada por esta escola.</Empty>:<div className="table-scroll"><table className="data-table"><thead><tr><th>Protocolo</th><th>Data</th><th>Contrato</th><th>Tipo</th><th>Situação</th><th>Detalhes</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.protocol}</td><td>{r.date}</td><td>{contractName(r.contractId)}</td><td>{r.type}</td><td>{r.status}</td><td><Link to={`/painel/transporte/escola/${schoolId}/ocorrencias/${r.id}`}>Acompanhar</Link></td></tr>)}</tbody></table></div>}</section></>;
}
