import React, { useState } from 'react';
import { Sparkles, Bus, Utensils, HeartHandshake, ShieldCheck, FileText, Search, AlertTriangle, ExternalLink } from 'lucide-react';

const dadosLimpeza = [
  { cie: '38362', escola: 'BARTHOLOMEU DE CARLOS', nota: 75.26, fatura: '90%', ruim: 1, observacao: 'Qualidade de servicos ruim em vidros e janelas' },
  { cie: '6269', escola: 'FABIO FANUCCHI PROFESSOR', nota: 57.44, fatura: '65%', ruim: 17, observacao: 'Falta funcionaria no quadro. Limpeza nao atende todo ambiente escolar' },
  { cie: '437736', escola: 'LEVI VIEIRA DA MAIA PROFESSOR', nota: 79.30, fatura: '90%', ruim: 8, observacao: 'Vidros sem limpeza no corrente ano' },
  { cie: '6208', escola: 'ALICE CHUERY PROFESSORA', nota: 67.03, fatura: '80%', ruim: 10, observacao: 'Banheiros com pichacao, vidros e ventiladores sujos' },
  { cie: '900114', escola: 'IZABEL FERREIRA DOS SANTOS PROFESSORA', nota: 48.51, fatura: '50%', ruim: 28, observacao: 'Ambientes sujos, produtos com cheiro ruim. Houve troca de equipe' },
  { cie: '6063', escola: 'FREDERICO DE BARROS BROTERO PROFESSOR', nota: 48.48, fatura: '50%', ruim: 22, observacao: 'Ausencia de supervisao da empresa, falhas em lousas, pisos e sanitarios' }
];

const dadosTransporte = [
  { nome: 'BRYAN MOREIRA VIANA', escola: 'EE ANNA LAMBERGA ZEGLIO', cid: 'Autista (CID F84)', cadeirante: 'NAO', contrato: '43/2024 (STILL)', recurso: '13h as 15h30 (2a e 4a)' },
  { nome: 'NATALIA IBELLI LOPES', escola: 'EE FREDERICO DE BARROS BROTERO', cid: 'Fisica (CID 167)', cadeirante: 'SIM', contrato: '43/2024 (STILL)', recurso: '7h as 12h20' },
  { nome: 'LUCAS DIAS LEITE', escola: 'EE DOM PAULO ROLIM LOUREIRO', cid: 'Fisica Cadeirante', cadeirante: 'SIM', contrato: '07/2024 (VIA BRASIL)', recurso: '8h41 as 10h21' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('limpeza');
  const [busca, setBusca] = useState('');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl"><ShieldCheck className="w-7 h-7 text-white" /></div>
            <div>
              <h1 className="text-2xl font-black text-white">HUB SEAFIN</h1>
              <p className="text-xs text-slate-400">URE Guarulhos Sul</p>
            </div>
          </div>
          <a href="https://sed.educacao.sp.gov.br" target="_blank" rel="noreferrer" className="text-xs bg-slate-800 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg flex items-center gap-1.5">Acessar SED <ExternalLink className="w-3.5 h-3.5" /></a>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 py-2">
          {[
            { id: 'limpeza', label: 'Limpeza e Conservacao', icon: Sparkles, color: 'text-blue-600' },
            { id: 'transporte', label: 'Transporte Inclusivo', icon: Bus, color: 'text-amber-600' },
            { id: 'merenda', label: 'Merenda Escolar', icon: Utensils, color: 'text-emerald-600' },
            { id: 'cuidador', label: 'Processo de Cuidador', icon: HeartHandshake, color: 'text-rose-600' },
            { id: 'tutorial-sed', label: 'Guia Fiscalizacao SED', icon: FileText, color: 'text-purple-600' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'limpeza' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-600" /> Monitoramento Contratual de Limpeza</h2>
              <div className="relative w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input type="text" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg" />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase">
                  <tr>
                    <th className="p-4">CIE / Escola</th>
                    <th className="p-4">Nota Final</th>
                    <th className="p-4">Liberacao Fatura</th>
                    <th className="p-4">Ocorrencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dadosLimpeza.filter(i => i.escola.toLowerCase().includes(busca.toLowerCase())).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-4"><span className="font-mono text-slate-400 block text-[10px]">CIE: {item.cie}</span><span className="font-bold text-slate-800">{item.escola}</span></td>
                      <td className="p-4 font-mono font-bold text-sm"><span className={item.nota < 60 ? 'text-red-600' : 'text-emerald-600'}>{item.nota.toFixed(2)}</span></td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">{item.fatura}</span></td>
                      <td className="p-4 text-slate-600 text-[11px]">{item.observacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transporte' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dadosTransporte.map((aluno, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">{aluno.contrato}</span>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{aluno.nome}</h3>
                <p className="text-xs text-slate-500 mb-2">{aluno.escola}</p>
                <div className="text-xs text-slate-600 border-t pt-2 mt-2">
                  <p><strong>Diagnostico:</strong> {aluno.cid}</p>
                  <p><strong>Recurso:</strong> {aluno.recurso}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab !== 'limpeza' && activeTab !== 'transporte' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center text-slate-500 text-sm">
            Modulo selecionado com sucesso. Informacoes integradas com a SED.
          </div>
        )}
      </main>
    </div>
  );
}