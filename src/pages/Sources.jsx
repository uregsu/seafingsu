import { useSeafin } from '../contexts/SeafinContext';
import { filterItems, modules, month } from '../data/operations';
import { Empty, PageTitle } from '../components/SeafinUI';

export default function Sources() {
  const {base, filters, directory}=useSeafin();
  const rows=filterItems(base.registros,filters);
  return <><PageTitle title="Fontes de Dados">Vínculo entre arquivos, registros, competências e transformações.</PageTitle><section className="panel"><h3>Relatórios de fiscalização</h3><p>Oito arquivos originais consolidados em três registros. A importação inicial não registrou sua data: ela permanece como não informada. Valores monetários convertidos em centavos; duplicatas idênticas agrupadas por UG, processo, contrato, ano e mês. Nenhum valor da origem foi corrigido.</p></section>{!rows.length?<Empty>Nenhuma fonte financeira para os filtros selecionados.</Empty>:rows.map(r=><section className="panel" key={r.id}><h3>{modules[r.categoria]} · {month(r.competencia)} · {r.contrato}</h3><p>1 registro único · {r.fontes.length} arquivos · Importação inicial e atualização na origem: não informadas.</p><ul>{r.fontes.map(f=><li key={f.arquivo} className="source-text"><strong>{f.arquivo}</strong><p>{f.aba}!{f.intervalo} · Tipo: resumo financeiro e fiscalização por contrato</p><small>SHA-256: {f.sha256}</small></li>)}</ul></section>)}<section className="panel"><h3>Cadastro institucional reutilizado</h3><p>{directory.source} · {directory.schools.length} escolas · Sincronização local: {new Date(directory.syncedAt).toLocaleString('pt-BR')}</p><p>Códigos e nomes preservados. CIE não disponível. O adaptador usa os identificadores institucionais existentes e não cria uma tabela de escolas.</p></section></>;
}
