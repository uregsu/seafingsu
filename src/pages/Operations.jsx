import { useState } from 'react';
import { useSeafin } from '../contexts/SeafinContext';
import { modules, statuses, stages, filterItems, finished, evidenceUrl } from '../data/operations';
import { Empty, Metric, PageTitle } from '../components/SeafinUI';

export default function Operations({ kind = 'pendencia', module = '', embedded = false }) {
  const { items, schools, filters, save } = useSeafin();
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');
  const [message, setMessage] = useState('');
  const label = kind === 'processo' ? 'Processos de cuidador' : kind === 'ocorrencia' ? 'Ocorrências' : 'Central de pendências';
  const records = filterItems(items, filters).filter(i => i.kind === kind && (!module || i.module === module) && (!priority || i.priority === priority) && `${i.title} ${i.responsible} ${i.sei || ''} ${schools.find(s => s.id === i.schoolId)?.name || ''}`.toLowerCase().includes(search.toLowerCase()));
  const completed = records.filter(r => r.stage === 'Concluído' && r.receivedDate && r.completedDate);
  const avg = completed.length ? completed.reduce((sum, r) => sum + (new Date(r.completedDate).getTime() - new Date(r.receivedDate).getTime()) / 86400000, 0) / completed.length : null;
  function open(item) {
    setError(''); setMessage('');
    setDraft(item || { kind, module: module || filters.module || 'merenda', schoolId: filters.school, competencia: filters.period, title: '', description: '', priority: 'Normal', responsible: '', status: statuses[0], stage: stages[0], deadline: '', nextAction: '', evidence: '', sei: '', requestType: '', requestDate: '', receivedDate: '', serviceStart: '', provider: '', completedDate: '', studentReference: '', history: [] });
  }
  const field = (name, title, type = 'text', required = false) => <label key={name}>{title}<input type={type} required={required} value={draft[name] || ''} onChange={e => setDraft(d => ({ ...d, [name]: e.target.value }))} /></label>;
  function submit(event) {
    event.preventDefault();
    try {
      if (draft.kind === 'processo' && draft.stage === 'Concluído' && !draft.completedDate) throw Error('Informe a data de conclusão.');
      if (draft.completedDate && draft.receivedDate && draft.completedDate < draft.receivedDate) throw Error('Conclusão anterior à entrada no SEAFIN.');
      if (draft.requestDate && draft.receivedDate && draft.receivedDate < draft.requestDate) throw Error('Entrada anterior à solicitação.');
      save(draft); setDraft(null); setMessage('Registro salvo neste navegador.');
    } catch (err) { setError(err.message); }
  }
  return <section className={embedded ? 'operations-section' : ''}>
    <PageTitle title={label}>Registre providências e referências de evidências. Não há sincronização entre computadores.</PageTitle>
    {kind === 'processo' && <div className="metrics-grid">
      <Metric title="Processos ativos" value={records.filter(r => !finished(r)).length} />
      <Metric title="Aguardando documentação" value={records.filter(r => r.stage === 'Pendência documental').length} />
      <Metric title="Providência externa" value={records.filter(r => r.stage === 'Aguardando providência externa').length} />
      <Metric title="Atendimentos iniciados" value={records.filter(r => r.serviceStart).length} />
      <Metric title="Concluídos" value={records.filter(r => r.stage === 'Concluído').length} />
      <Metric title="Tempo médio de tramitação" value={avg == null ? 'Sem dados' : `${avg.toFixed(1)} dias`} note="Concluídos com datas de entrada e conclusão" />
    </div>}
    <div className="toolbar"><label>Buscar assunto, escola ou responsável<input value={search} onChange={e => setSearch(e.target.value)} /></label><label>Prioridade<select value={priority} onChange={e => setPriority(e.target.value)}><option value="">Todas</option>{['Baixa','Normal','Alta','Crítica'].map(p => <option key={p}>{p}</option>)}</select></label><button className="primary" onClick={() => open(null)}>Novo registro</button></div>
    {message && <p role="status" className="success-box">{message}</p>}
    {!records.length ? <Empty>Nenhum registro operacional na seleção. Os relatórios importados não criam ocorrências ou processos automaticamente.</Empty> : <div className="table-scroll"><table className="data-table"><thead><tr>{['Assunto / escola','Módulo','Situação / prioridade','Responsável','Prazo / próxima ação','Atualização','Detalhes'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{records.map(item => <tr key={item.id}><td><strong>{item.title}</strong><small>{schools.find(s => s.id === item.schoolId)?.name || 'Regional / escola não vinculada'}</small>{item.sei && <small>SEI {item.sei}</small>}</td><td>{modules[item.module]}</td><td>{kind === 'processo' ? item.stage : item.status}<small>{item.priority}</small></td><td>{item.responsible || 'Não informado'}</td><td>{item.deadline || 'Não informado'}<small>{item.nextAction || 'Sem próxima ação'}</small></td><td>{new Date(item.updatedAt).toLocaleString('pt-BR')}</td><td><button className="secondary" onClick={() => open(item)}>Abrir</button></td></tr>)}</tbody></table></div>}
    {draft && <section className="panel record-editor" aria-label="Editor de registro"><h3>{draft.id ? 'Detalhamento e atualização' : 'Novo registro operacional'}</h3><form onSubmit={submit}>
      <div className="form-grid">
        {field('title','Assunto','text',true)}
        <label>Módulo<select value={draft.module} disabled={!!module} onChange={e => setDraft(d => ({...d,module:e.target.value}))}>{Object.entries(modules).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
        <label>Escola<select value={draft.schoolId} required={kind === 'processo'} onChange={e => setDraft(d => ({...d,schoolId:e.target.value}))}><option value="">Regional / não vinculada</option>{schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        {field('competencia','Competência','month',true)}
        <label>Prioridade<select value={draft.priority} onChange={e => setDraft(d => ({...d,priority:e.target.value}))}>{['Baixa','Normal','Alta','Crítica'].map(p => <option key={p}>{p}</option>)}</select></label>
        <label>{kind === 'processo' ? 'Etapa atual' : 'Situação'}<select value={kind === 'processo' ? draft.stage : draft.status} onChange={e => setDraft(d => ({...d,[kind === 'processo' ? 'stage' : 'status']:e.target.value}))}>{(kind === 'processo' ? stages : statuses).map(s => <option key={s}>{s}</option>)}</select></label>
        {field('responsible','Responsável')}{field('deadline','Prazo','date')}{field('nextAction','Próxima ação / providência')}{field('evidence','Referência de evidência (HTTP/HTTPS)','url')}
        {kind === 'processo' && <>{field('sei','Número do processo SEI')}{field('requestType','Tipo de solicitação')}{field('requestDate','Data da solicitação','date')}{field('receivedDate','Entrada no SEAFIN','date')}{field('provider','Empresa / prestador')}{field('serviceStart','Início do atendimento','date')}{field('completedDate','Data de conclusão','date')}{field('studentReference','Referência interna anonimizada (opcional)')}</>}
      </div>
      <label>Descrição, pendências e observações<textarea rows={3} value={draft.description} onChange={e => setDraft(d => ({...d,description:e.target.value}))} /></label>
      {error && <p role="alert" className="error-box">{error}</p>}
      <div className="toolbar"><button className="primary" type="submit">Salvar registro</button><button className="secondary" type="button" onClick={() => setDraft(null)}>Cancelar / fechar</button>{draft.evidence && evidenceUrl(draft.evidence) && <a href={evidenceUrl(draft.evidence)} target="_blank" rel="noreferrer">Abrir evidência ↗</a>}</div>
    </form><h4>Histórico do registro</h4><ol className="timeline">{draft.history.map((h,i) => <li key={i}><strong>{h.action} · {new Date(h.at).toLocaleString('pt-BR')}</strong><p>{h.stage || h.status} · {h.actor}</p><p>{h.nextAction || 'Sem próxima ação registrada'}</p></li>)}</ol></section>}
  </section>;
}
