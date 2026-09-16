import { Link } from 'react-router-dom';
import { useSeafin } from '../contexts/SeafinContext';
import { modules, filterItems, money, month, finished } from '../data/operations';
import { Metric, PageTitle } from '../components/SeafinUI';
import { useTransport } from '../transport/TransportContext';
import { terminal, alertsFor } from '../transport/domain';

export default function Overview() {
  const { base, schools, items, alerts, filters, directory } = useSeafin();
  const { state: transport } = useTransport();
  const transportItems = transport.occurrences.map(r => ({ id:r.id, module:'transporte', kind:'ocorrencia', schoolId:r.schoolId, competencia:r.date.slice(0,7), status:terminal(r)?'Resolvida':r.status }));
  const transportAlerts = alertsFor(transport.occurrences, transport.settings).map(a => {const r=transport.occurrences.find(o=>o.id===a.occurrenceId);return {...a,module:'transporte',schoolId:r.schoolId,competencia:r.date.slice(0,7),status:r.status};});
  const finance = filterItems(base.registros, filters);
  const operations = filterItems([...items, ...transportItems], filters);
  const visibleAlerts = filterItems([...alerts.map(a => ({ ...a, status: a.record?.status || 'Aberta' })), ...transportAlerts], filters);
  const total = finance.length ? finance.reduce((s, r) => s + r.valor_total_a_pagar_centavos, 0) : null;
  return <>
    <PageTitle title="Visão geral SEAFIN">Serviços, competências e providências em um só lugar · {month(filters.period)}</PageTitle>
    <div className="metrics-grid">
      <Metric title="Escolas no cadastro institucional" value={schools.length} note="Cobertura individual dos contratos ainda não identificada" />
      <Metric title="Total a pagar na seleção" value={money(total)} note="Não comprova pagamento efetuado" />
      <Metric title="Contratos com relatório" value={new Set(finance.map(r => r.contrato)).size} note="Vigência não informada; atividade contratual não confirmada" />
      <Metric title="Pendências em acompanhamento" value={operations.filter(i => i.kind === 'pendencia' && !finished(i)).length} note="Registros operacionais locais" />
      <Metric title="Alertas na seleção" value={visibleAlerts.length} />
      <Metric title="Ocorrências em acompanhamento" value={operations.filter(i => i.kind === 'ocorrencia' && !finished(i)).length} />
    </div>
    <p className="muted">Atualização dos relatórios na origem: não informada. Cadastro institucional sincronizado em {new Date(directory.syncedAt).toLocaleDateString('pt-BR')}.</p>
    <div className="module-grid">{Object.entries(modules).filter(([key]) => !filters.module || key === filters.module).map(([key, label]) => {
      const rows = finance.filter(r => r.categoria === key);
      const all = base.registros.filter(r => r.categoria === key);
      const pending = operations.filter(i => i.module === key && !finished(i));
      return <Link key={key} to={`/painel/${key}`} className="module-card">
        <span className={`module-mark ${key}`}>{label.slice(0, 1)}</span><h3>{label}</h3>
        <strong>{rows.length ? money(rows.reduce((s, r) => s + r.valor_total_a_pagar_centavos, 0)) : 'Sem valor informado'}</strong>
        <p>Última competência recebida: {month(all.map(r => r.competencia).sort().at(-1))}</p>
        <p>Unidades informadas: {rows.length === 1 ? rows[0].unidades_fiscalizadas : 'Não consolidado'}</p>
        <p>{pending.filter(i => i.kind === 'ocorrencia').length} ocorrências · {pending.filter(i => i.kind === 'pendencia').length} pendências · {visibleAlerts.filter(a => a.module === key).length} alertas</p>
        <span className="badge">{rows.length ? 'Relatório disponível' : pending.length ? 'Em acompanhamento local' : 'Sem relatório na seleção'}</span>
        <span className="card-action">Abrir módulo →</span>
      </Link>;
    })}</div>
    <section className="panel"><h3>Leitura dos indicadores</h3><p>Os relatórios de limpeza e merenda são agregados por contrato. As 82 unidades informadas não estão associadas a CIEs; selecionar uma escola não atribui a ela valores regionais. A contagem de unidades não é somada entre contratos ou competências.</p><Link to="/painel/alertas">Consultar alertas e divergências →</Link></section>
  </>;
}
