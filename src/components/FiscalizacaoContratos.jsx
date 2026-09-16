import { useState } from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import base from '../data/fiscalizacoes.json';

const moeda = valor => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor / 100);
const periodo = valor => `${valor.slice(5)}/${valor.slice(0, 4)}`;
const competencias = [...new Set(base.registros.map(r => r.competencia))].sort().reverse();

export default function FiscalizacaoContratos({ categoria, competenciaExterna, onCompetencia }) {
  const [localCompetencia, setLocalCompetencia] = useState(competencias[0]);
  const competencia = competenciaExterna || localCompetencia;
  const setCompetencia = onCompetencia || setLocalCompetencia;
  const registros = base.registros.filter(r => r.categoria === categoria && r.competencia === competencia);
  return (
    <section className="space-y-5" aria-labelledby="fiscalizacao-titulo">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="fiscalizacao-titulo" className="flex items-center gap-2 text-xl font-bold text-slate-900"><FileText size={22} aria-hidden="true" />Fiscalização de contratos</h2>
          <p className="mt-2 text-sm text-slate-500">{categoria === 'limpeza' ? 'Limpeza e conservação' : 'Merenda escolar'} · Relatórios importados das planilhas</p>
        </div>
        <div>
          <label htmlFor="competencia" className="mb-1 block text-sm font-semibold">Competência</label>
          <select id="competencia" value={competencia} onChange={e => setCompetencia(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 focus:ring-2 focus:ring-blue-600">
            {competencias.map(mes => <option key={mes} value={mes}>{periodo(mes)}</option>)}
          </select>
        </div>
      </div>
      <p className="text-sm text-slate-600">Base consolidada: {base.arquivos_recebidos} arquivos, {base.registros_unicos} registros de contrato por mês e {base.copias_redundantes} cópias duplicadas desconsideradas.</p>
      {registros.length === 0 && <div role="status" className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">Nenhum relatório de {categoria} recebido para {periodo(competencia)}. A ausência de relatório não significa valor zero.</div>}
      {registros.map(registro => (
        <article key={registro.id} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Contrato {registro.contrato}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-700">{registro.credor}</p>
              <p className="mt-1 text-xs text-slate-500">Processo {registro.processo} · UG {registro.ug} · {periodo(registro.competencia)}</p>
              <p className="mt-2 text-xs text-slate-500">{registro.objeto_original}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Status informado: {registro.status}</span>
          </div>
          <dl className="grid gap-3 md:grid-cols-3">
            {[
              ['Valor do cronograma', registro.valor_cronograma_centavos],
              ['Total a pagar', registro.valor_total_a_pagar_centavos],
              ['Diferença informada', registro.diferenca_centavos],
            ].map(([label, valor]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><dt className="text-sm text-slate-600">{label}</dt><dd className="mt-2 text-xl font-bold tabular-nums text-slate-900">{moeda(valor)}</dd></div>)}
          </dl>
          <p className="text-xs leading-relaxed text-slate-500">Diferença = cronograma − total a pagar. O relatório não identifica esse valor como glosa ou economia, nem comprova pagamento efetuado. O cronograma não é somado entre meses.</p>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h4 className="mb-3 font-semibold text-slate-900">Situação da fiscalização</h4>
              <dl className="space-y-2 text-sm">
                {[['Unidades fiscalizadas', registro.unidades_fiscalizadas], ['Finalizadas', registro.finalizadas], ['Em andamento', registro.em_andamento], ['Pendentes', registro.pendentes]].map(([label, valor]) => <div key={label} className="flex justify-between gap-3"><dt className="text-slate-600">{label}</dt><dd className="font-semibold tabular-nums">{valor}</dd></div>)}
              </dl>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-slate-900">Preenchimento das respostas</h4>
              <dl className="space-y-2 text-sm">
                {[['Completas', registro.preenchimento.completas], ['Parciais', registro.preenchimento.parciais], ['Sem resposta', registro.preenchimento.sem_resposta]].map(([label, valor]) => <div key={label} className="flex justify-between gap-3"><dt className="text-slate-600">{label}</dt><dd className="font-semibold tabular-nums">{valor}</dd></div>)}
              </dl>
            </div>
          </div>
          {registro.alertas.includes('FINALIZADAS_COM_PREENCHIMENTO_SEM_RESPOSTA') && <div role="note" className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><AlertTriangle size={22} className="shrink-0" aria-hidden="true" /><p><strong>Divergência no relatório de julho:</strong> {registro.finalizadas} fiscalizações finalizadas e {registro.preenchimento.sem_resposta} sem resposta. Os valores originais foram preservados; confirme o preenchimento no sistema de origem.</p></div>}
          <p className="text-xs text-slate-500">Contagens referentes a este contrato e competência. Não representam escolas distintas somadas entre contratos ou meses. As planilhas não contêm notas ou ocorrências por escola.</p>
          <details className="border-t border-slate-100 pt-4 text-sm">
            <summary className="cursor-pointer font-semibold text-blue-700">Consultar fontes ({registro.fontes.length} arquivos com o mesmo registro)</summary>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">{registro.fontes.map(fonte => <li key={fonte.arquivo} className="break-words">{fonte.arquivo} · {fonte.aba}!{fonte.intervalo}</li>)}</ul>
          </details>
        </article>
      ))}
    </section>
  );
}
