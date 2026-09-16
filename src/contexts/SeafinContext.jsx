import { createContext, useContext, useState } from 'react';
import base from '../data/fiscalizacoes.json';
import directory from '../data/escolas.json';
import { useAuth } from './AuthContext';
import { saveRecord, operationalAlerts } from '../data/operations';

const Context = createContext(null);
const KEY = 'seafin:operations:v1';
function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { items: [], reviews: {}, error: '' };
    const value = JSON.parse(raw);
    if (!Array.isArray(value.items) || !value.reviews || value.items.some(item => !item.id || !item.kind)) throw Error();
    return { ...value, error: '' };
  } catch { return { items: [], reviews: {}, error: 'Não foi possível ler os registros locais. Escrita bloqueada para evitar perda de dados.' }; }
}
export function SeafinProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState(read);
  const [filters, setFilters] = useState({ period: [...new Set(base.registros.map(r => r.competencia))].sort().at(-1), school: '', module: '', status: '' });
  function persist(next) {
    if (state.error) throw Error(state.error);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { throw Error('Armazenamento indisponível ou cheio. O registro não foi salvo.'); }
    setState({ ...next, error: '' });
  }
  function save(draft) { persist({ ...state, items: saveRecord(state.items, draft, user?.username || 'Usuário local') }); }
  function review(id, status, note) {
    if (!note.trim()) throw Error('Registre a análise ou justificativa.');
    const old = state.reviews[id];
    const event = { status, note, at: new Date().toISOString(), actor: user?.username };
    persist({ ...state, reviews: { ...state.reviews, [id]: { ...event, history: [...(old?.history || []), event] } } });
  }
  const alerts = [...base.registros.filter(r => r.alertas.length).map(r => ({ id: r.id, module: r.categoria, competencia: r.competencia, schoolId: null, title: 'Inconsistência entre situação e preenchimento', detail: `${r.finalizadas} finalizadas; ${r.preenchimento.sem_resposta} sem resposta. Valor esperado não informado pela fonte.`, source: `${r.fontes[0].arquivo} · ${r.fontes[0].aba}!${r.fontes[0].intervalo}`, record: r })), ...operationalAlerts(state.items)];
  return <Context.Provider value={{ base, schools: directory.schools, directory, ...state, filters, setFilters, save, review, alerts }}>{children}</Context.Provider>;
}
export const useSeafin = () => useContext(Context);
