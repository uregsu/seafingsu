import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSeafin } from '../contexts/SeafinContext';
import { modules, filterItems, finished, month } from '../data/operations';
import { Empty, PageTitle } from '../components/SeafinUI';
import { useTransport } from '../transport/TransportContext';
import { terminal } from '../transport/domain';

export default function Schools() {
  const { schoolId } = useParams();
  const { schools, items, filters, setFilters } = useSeafin();
  const { state: transport } = useTransport();
  const transportItems = transport.occurrences.map(r=>({id:r.id,module:'transporte',kind:'ocorrencia',schoolId:r.schoolId,competencia:r.date.slice(0,7),title:r.protocol,status:terminal(r)?'Resolvida':r.status,history:r.history.map(h=>({...h,action:`${h.from||'Envio'} → ${h.to}`}))}));
  const [search,setSearch] = useState('');
  const selected = schools.find(s => s.id === (schoolId || filters.school));
  if (schoolId && !selected) return <Empty>Escola não encontrada. <Link to="/painel/escolas">Voltar ao cadastro</Link></Empty>;
  const records = selected ? filterItems([...items, ...transportItems], {...filters,school:selected.id}) : [];
  return <><PageTitle title={selected ? selected.name : 'Visão por escola'}>SEAFIN 360 da Escola · Cadastro institucional do SuperBI360</PageTitle>
    {selected ? <><p className="muted">CIE: {selected.cie || 'não informado no cadastro disponível'} · Código institucional: {selected.id}</p><div className="module-grid">{Object.entries(modules).filter(([id]) => !filters.module || filters.module === id).map(([id,name]) => {const data=records.filter(r=>r.module===id);return <section className="panel" key={id}><h3>{name}</h3><p>Valores e contratos por escola: não informados.</p><p>{data.filter(r=>r.kind==='pendencia'&&!finished(r)).length} pendências · {data.filter(r=>r.kind==='ocorrencia').length} ocorrências · {data.filter(r=>r.kind==='processo').length} processos locais</p>{data.length ? <ul>{data.map(r=><li key={r.id}>{r.title} · {month(r.competencia)} · {r.kind==='processo'?r.stage:r.status}</li>)}</ul> : <p>Sem registros na seleção.</p>}<Link to={`/painel/${id}`} onClick={() => setFilters(f => ({...f, school: selected.id}))}>Abrir módulo →</Link></section>})}</div><section className="panel"><h3>Histórico recente na seleção</h3><ol className="timeline">{records.flatMap(r=>(r.history||[]).map(h=>({...h,title:r.title}))).sort((a,b)=>b.at.localeCompare(a.at)).slice(0,10).map((h,i)=><li key={i}>{new Date(h.at).toLocaleString('pt-BR')} · {h.title} · {h.action}</li>)}</ol>{!records.length && <p>Sem histórico operacional na seleção.</p>}</section></> : <>
      <label className="search-label">Pesquisar escola<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nome ou código institucional" /></label>
      <div className="table-scroll"><table className="data-table"><thead><tr><th>Escola</th><th>CIE</th><th>Fonte</th><th>Ficha</th></tr></thead><tbody>{schools.filter(s=>`${s.name} ${s.id}`.toLowerCase().includes(search.toLowerCase())).map(s=><tr key={s.id}><td>{s.name}</td><td>{s.cie || 'Não informado'}</td><td>Cadastro SuperBI360</td><td><Link to={`/painel/escolas/${s.id}`}>Abrir ficha →</Link></td></tr>)}</tbody></table></div>
    </>}</>;
}

