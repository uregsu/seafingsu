import React, { useState } from 'react';
import { 
  Sparkles, Bus, Utensils, HeartHandshake, ShieldCheck, 
  FileText, Search, AlertTriangle, ExternalLink 
} from 'lucide-react';

const dadosLimpeza = [
  { cie: '38362', escola: 'BARTHOLOMEU DE CARLOS', nota: 75.26, fatura: '90%', otimo: 10, bom: 48, regular: 17, ruim: 1, observacao: 'Qualidade de serviços ruim em vidros e janelas' },
  { cie: '6269', escola: 'FABIO FANUCCHI PROFESSOR', nota: 57.44, fatura: '65%', otimo: 10, bom: 14, regular: 37, ruim: 17, observacao: 'Falta funcionária no quadro. Limpeza não atende todo ambiente escolar' },
  { cie: '437736', escola: 'LEVI VIEIRA DA MAIA PROFESSOR', nota: 79.30, fatura: '90%', otimo: 19, bom: 43, regular: 1, ruim: 8, observacao: 'Vidros sem limpeza no corrente ano' },
  { cie: '6208', escola: 'ALICE CHUERY PROFESSORA', nota: 67.03, fatura: '80%', otimo: 7, bom: 37, regular: 20, ruim: 10, observacao: 'Banheiros com pichação, vidros e ventiladores sujos' },
  { cie: '900114', escola: 'IZABEL FERREIRA DOS SANTOS PROFESSORA', nota: 48.51, fatura: '50%', otimo: 3, bom: 10, regular: 33, ruim: 28, observacao: 'Ambientes sujos, produtos com cheiro ruim. Houve troca de equipe' },
  { cie: '6063', escola: 'FREDERICO DE BARROS BROTERO PROFESSOR', nota: 48.48, fatura: '50%', otimo: 4, bom: 4, regular: 49, ruim: 22, observacao: 'Ausência de supervisão da empresa, falhas em lousas, pisos e sanitários' },
  { cie: '35725', escola: 'MARIA HILDA ORNELAS DE OLIVEIRA PROFESSORA', nota: 59.23, fatura: '65%', otimo: 3, bom: 25, regular: 22, ruim: 15, observacao: 'Muitos conflitos entre funcionárias, serviços em desacordo com contrato' },
  { cie: '48872', escola: 'MAURICIO GOULART DEPUTADO', nota: 87.63, fatura: '90%', otimo: 29, bom: 47, regular: 0, ruim: 0, observacao: 'Serviços dentro do esperado' }
];

const dadosTransporte = [
  { nome: 'BRYAN MOREIRA VIANA', escola: 'EE ANNA LAMBERGA ZEGLIO', cid: 'Autista (CID F84)', cadeirante: 'NÃO', contrato: '43/2024 (STILL)', empresa: 'STILL', recurso: '13h às 15h30 (2ª e 4ª)' },
  { nome: 'NATALIA IBELLI LOPES', escola: 'EE FREDERICO DE BARROS BROTERO', cid: 'Física (CID 167)', cadeirante: 'SIM', contrato: '43/2024 (STILL)', empresa: 'STILL', recurso: '7h às 12h20' },
  { nome: 'GUILHERME MARTINS SILVA', escola: 'EE LINDAMIL BARBOSA DE OLIVEIRA', cid: 'Paralisia Cerebral (CID G80)', cadeirante: 'SIM', contrato: '43/2024 (STILL)', empresa: 'STILL', recurso: '7h às 9h30 (3ª e 5ª)' },
  { nome: 'LUCAS DIAS LEITE', escola: 'EE DOM PAULO ROLIM LOUREIRO', cid: 'Física Cadeirante', cadeirante: 'SIM', contrato: '07/2024 (VIA BRASIL)', empresa: 'EXPRESSO VIA BRASIL', recurso: '8h41 às 10h21' },
  { nome: 'DENISE ADRIELE DA SILVA CARLOS', escola: 'NOVA PRANA - COLÉGIO INCLUSIVO', cid: 'Autismo Infantil (F84)', cadeirante: 'NÃO', contrato: '05/2023 (STILL)', empresa: 'STILL', recurso: 'Não se aplica' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('limpeza');
  const [buscaLimpeza, setBuscaLimpeza] = useState('');
  const [buscaTransporte, setBuscaTransporte] = useState('');

  const limpezaFiltrada = dadosLimpeza.filter(item => 
    item.escola.toLowerCase().includes(buscaLimpeza.toLowerCase()) || 
    item.cie.includes(buscaLimpeza)
  );

  const transporteFiltrado = dadosTransporte.filter(item => 
    item.nome.toLowerCase().includes(buscaTransporte.toLowerCase()) || 
    item.escola.toLowerCase().includes(buscaTransporte.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-inner">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">HUB SEAFIN</h1>
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-blue-400/30">GSU</span>
              </div>
              <p className="text-xs text-slate-400">Serviço de Administração de Finanças e Infraestrutura • URE Guarulhos Sul</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://sed.educacao.sp.gov.br" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg transition-all font-medium">
              Acessar SED <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto py-2">
          {[
            { id: 'limpeza', label: 'Limpeza e Conservação', icon: Sparkles, color: 'text-blue-600' },
            { id: 'transporte', label: 'Transporte Inclusivo', icon: Bus, color: 'text-amber-600' },
            { id: 'merenda', label: 'Merenda Escolar', icon: Utensils, color: 'text-emerald-600' },
            { id: 'cuidador', label: 'Processo de Cuidador', icon: HeartHandshake, color: 'text-rose-600' },
            { id: 'tutorial-sed', label: 'Guia Fiscalização SED', icon: FileText, color: 'text-purple-600' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={lex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all \}>
                <Icon className={w-4 h-4 \} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'limpeza' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" /> Monitoramento Contratual de Limpeza (Contrato 264/24 - VIVA)
                </h2>
                <p className="text-xs text-slate-500 mt-1">Acompanhamento das avaliações mensais, notas de inspeção e retenção de faturas.</p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input type="text" placeholder="Buscar escola ou CIE..." value={buscaLimpeza} onChange={(e) => setBuscaLimpeza(e.target.value)} className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">CIE / Escola</th>
                      <th className="p-4">Nota Final</th>
                      <th className="p-4">Liberação Fatura</th>
                      <th className="p-4">Itens Ruim</th>
                      <th className="p-4">Relato da Unidade / Ocorrência</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {limpezaFiltrada.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <span className="font-mono text-slate-400 block text-[10px]">CIE: {item.cie}</span>
                          <span className="font-bold text-slate-800">{item.escola}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-sm">
                          <span className={item.nota < 60 ? 'text-red-600' : item.nota < 80 ? 'text-amber-600' : 'text-emerald-600'}>
                            {item.nota.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={px-2.5 py-1 rounded-full text-[11px] font-bold \}>
                            {item.fatura}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-700">
                          {item.ruim > 0 ? (
                            <span className="text-red-600 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> {item.ruim} itens
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-normal">Nenhum</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-600 max-w-md leading-relaxed text-[11px]">
                          {item.observacao}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transporte' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Bus className="w-5 h-5 text-amber-600" /> Transporte Escolar Inclusivo (Contratos 43/24, 07/24 e 05/23)
                </h2>
                <p className="text-xs text-slate-500 mt-1">Localizador de estudantes atendidos, verificação de cadeirantes e horários de contra-turno.</p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input type="text" placeholder="Buscar aluno ou escola..." value={buscaTransporte} onChange={(e) => setBuscaTransporte(e.target.value)} className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transporteFiltrado.map((aluno, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded border border-slate-200">{aluno.contrato}</span>
                    {aluno.cadeirante === 'SIM' && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">? Cadeirante</span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{aluno.nome}</h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">{aluno.escola}</p>
                  
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Diagnóstico/CID:</span>
                      <span className="font-semibold text-slate-700">{aluno.cid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sala de Recurso:</span>
                      <span className="font-semibold text-amber-700">{aluno.recurso}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'merenda' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-600" /> Merenda Escolar & Alimentação
            </h2>
            <p className="text-xs text-slate-500 mb-6">Gestão de abastecimento, guia de ateste na SED e controle de cardápios nas escolas estaduais.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
                <h3 className="font-bold text-emerald-900 text-sm mb-2">Ateste na SED</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">Acesse o sistema SED no menu Financeiro &gt; Contratos para confirmar o recebimento e manipulação mensal da merenda.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
                <h3 className="font-bold text-slate-800 text-sm mb-2">Relato de Intercorrências</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Registrar pontualmente qualquer divergência no recebimento de perecíveis ou alteração sem autorização técnica.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
                <h3 className="font-bold text-slate-800 text-sm mb-2">Inspeção de Cozinha</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Checklist de vestuário, higienização dos manipuladores e prazos de validade dos insumos entregues.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cuidador' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-rose-600" /> Processo de Cuidador / Apoio Escolar
            </h2>
            <p className="text-xs text-slate-500 mb-6">Acompanhamento dos Profissionais de Apoio Escolar (Atividade de Vida Diária - AVD) para alunos elegíveis.</p>

            <div className="bg-rose-50 border border-rose-200 p-6 rounded-xl mb-6">
              <h3 className="font-bold text-rose-900 text-sm mb-1">Acompanhamento de Frequência e Substituição</h3>
              <p className="text-xs text-rose-800 leading-relaxed">
                As faltas e substituições de cuidadores devem ser registradas no relatório mensal do contrato para cálculo proporcional do pagamento e manutenção da assistência contínua ao estudante.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'tutorial-sed' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" /> Guia Oficial de Fiscalização na SED (Versão 1.0 - 2026)
            </h2>
            <p className="text-xs text-slate-500 mb-6">Passo a passo padronizado para Diretores de Escola e Fiscais Técnicos da URE Guarulhos Sul.</p>

            <div className="space-y-4">
              {[
                { passo: 'Passo 1', titulo: 'Acesso à SED', desc: 'Acesse sed.educacao.sp.gov.br com usuário e senha ou Gov.br.' },
                { passo: 'Passo 2', titulo: 'Navegação do Menu', desc: 'Vá no caminho: Financeiro > Contratos > Fiscalização > Fiscalização de Contratos.' },
                { passo: 'Passo 3', titulo: 'Seleção do Objeto', desc: 'Selecione a opção "Por Escola", informe o Mês de Referência e selecione a Diretoria "GUARULHOS SUL".' },
                { passo: 'Passo 4', titulo: 'Atribuição de Notas e Anexos', desc: 'Preencha cada item avaliado (Ótimo, Bom, Regular, Ruim, Não se Aplica). Em caso de nota Regular ou Ruim, descreva a ocorrência (mínimo 20 caracteres) e anexe fotos legíveis.' },
                { passo: 'Passo 5', titulo: 'Conclusão da Fiscalização', desc: 'Revise os dados e clique em "Concluir". Lembre-se: após o encerramento do prazo, a SED conclui automaticamente atribuindo a nota pré-configurada.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <span className="font-bold text-xs bg-purple-600 text-white px-2.5 py-1 rounded-lg h-fit">{item.passo}</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{item.titulo}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
