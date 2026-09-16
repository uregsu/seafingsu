import { Link } from 'react-router-dom';
import { useSeafin } from '../contexts/SeafinContext';
import FiscalizacaoContratos from '../components/FiscalizacaoContratos';
import { Empty, PageTitle } from '../components/SeafinUI';
import { modules, money, month } from '../data/operations';
import Operations from './Operations';

export default function ServiceModule({ module }) {
  const { base, filters, setFilters } = useSeafin();
  const rows = base.registros.filter(r => r.categoria === module).sort((a, b) => a.competencia.localeCompare(b.competencia));
  const history = Object.entries(rows.reduce((acc, r) => ({ ...acc, [r.competencia]: (acc[r.competencia] || 0) + r.valor_total_a_pagar_centavos }), {}));
  const max = Math.max(1, ...history.map(([, value]) => value));
  const moduleVisible = !filters.module || filters.module === module;
  return <>
    <PageTitle title={modules[module]}>{module === 'cuidador' ? 'Processos, etapas e atendimento às unidades escolares.' : 'Acompanhamento de contratos, competências e providências.'}</PageTitle>
    {!moduleVisible ? <Empty>O filtro global de módulo não corresponde a esta página.</Empty> : <>
      {['merenda', 'limpeza'].includes(module) ? <>
        {filters.school ? <Empty>Os relatórios recebidos não têm detalhamento por escola. Nenhum valor regional foi atribuído à escola selecionada.</Empty> : filters.status && filters.status !== 'Finalizado' ? <Empty>Nenhum relatório com a situação selecionada.</Empty> : <FiscalizacaoContratos categoria={module} competenciaExterna={filters.period} onCompetencia={value => setFilters(f => ({ ...f, period: value }))} />}
        <section className="panel"><h3>Evolução por competência</h3><p className="muted">Histórico regional completo, independente do filtro de escola ou situação. Total a pagar; não soma o cronograma entre meses.</p>
          {history.map(([period, amount], i) => <div className="history-bar" key={period}><span>{month(period)}</span><div><div style={{ width: `${amount / max * 100}%` }} /></div><strong>{money(amount)}</strong><small>{i > 0 && history[i - 1][1] !== 0 ? `${((amount / history[i - 1][1] - 1) * 100).toFixed(2)}% vs. competência anterior` : 'Primeira competência disponível'}</small></div>)}
        </section>
        <section className="panel"><h3>Por escola</h3><p>Não há CIE, nome da escola ou rateio individual nas fontes recebidas. Valor médio por escola não calculado: o escopo do valor regional precisa ser confirmado.</p><Link to="/painel/escolas">Consultar cadastro e acompanhamento por escola →</Link></section>
        {module === 'limpeza' && <section className="panel"><h3>Alertas e divergências</h3><p>Julho/2026: 82 finalizadas e 82 sem resposta. A inconsistência pertence ao registro original, sem criar outra fiscalização.</p><Link to="/painel/alertas">Consultar e registrar análise →</Link></section>}
      </> : module === 'transporte' ? <Empty>Dados de Transporte Escolar ainda não foram integrados.</Empty> : null}
      <Operations key={module} kind={module === 'cuidador' ? 'processo' : 'ocorrencia'} module={module} embedded />
    </>}
  </>;
}
