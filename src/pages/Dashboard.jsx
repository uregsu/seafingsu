import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSeafin } from '../contexts/SeafinContext';
import { modules, month, statuses, stages } from '../data/operations';

export default function Dashboard() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const { base, schools, filters, setFilters, items, error } = useSeafin();
  const periods = [...new Set([...base.registros.map(r => r.competencia), ...items.map(r => r.competencia)])].filter(Boolean).sort().reverse();
  const update = (key, value) => setFilters(old => ({ ...old, [key]: value }));
  const links = [['', 'Visão geral'], ...Object.entries(modules), ['escolas', 'Visão por escola'], ['pendencias', 'Central de pendências'], ['ocorrencias', 'Ocorrências'], ['alertas', 'Alertas'], ['fontes', 'Fontes de Dados']];
  if (user?.role === 'school') {
    const prefix = `/painel/transporte/escola/${user.schoolId}`;
    if (!user.schoolId) return <p role="alert">Perfil sem escola vinculada.</p>;
    if (location.pathname !== prefix && !location.pathname.startsWith(`${prefix}/`)) return <Navigate to={prefix} replace />;
    return <div className="seafin-shell school-shell"><header className="institution-header"><h1>SEAFIN · Transporte Escolar</h1><button onClick={logout}>Sair</button></header><main><Outlet /></main></div>;
  }
  return <div className="seafin-shell">
    <aside className="seafin-sidebar">
      <div className="brand"><ShieldCheck size={30} /><div><strong>SEAFIN</strong><small>SUPERBI360 | GSU</small></div></div>
      <nav aria-label="Navegação principal">{links.map(([path, label]) => <NavLink end key={path} to={`/painel${path ? `/${path}` : ''}`}>{label}</NavLink>)}</nav>
      <p>Serviço de Administração<br />e Finanças<br /><strong>URE Guarulhos Sul</strong></p>
      <button className="logout" onClick={logout}><LogOut size={16} /> Sair</button>
      <a className="external-sed" href="https://sed.educacao.sp.gov.br" target="_blank" rel="noreferrer">Acessar SED ↗</a>
    </aside>
    <div className="seafin-content">
      <header className="institution-header"><div><h1>Serviço de Administração e Finanças</h1><p>Gestão integrada de serviços, contratos e atendimento às unidades escolares.</p></div><span>URE Guarulhos Sul</span></header>
      <div className="local-notice">Ambiente local · Registros operacionais salvos neste navegador, sem sincronização com o Supabase. Não registre nomes de estudantes ou diagnósticos.</div>
      {error && <p role="alert" className="error-box">{error}</p>}
      <section className="global-filters" aria-label="Filtros globais">
        <label>Competência<select value={filters.period} onChange={e => update('period', e.target.value)}>{periods.map(p => <option key={p} value={p}>{month(p)}</option>)}</select></label>
        <label>Escola<select value={filters.school} onChange={e => update('school', e.target.value)}><option value="">Todas as escolas</option>{schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        <label>Módulo<select value={filters.module} onChange={e => update('module', e.target.value)}><option value="">Todos os módulos</option>{Object.entries(modules).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <label>Situação<select value={filters.status} onChange={e => update('status', e.target.value)}><option value="">Todas as situações</option>{[...new Set(['Finalizado', ...statuses, ...stages])].map(s => <option key={s}>{s}</option>)}</select></label>
        <button className="secondary" onClick={() => setFilters({ period: periods[0], school: '', module: '', status: '' })}>Limpar filtros</button>
      </section>
      <main id="conteudo"><Outlet /></main>
    </div>
  </div>;
}
