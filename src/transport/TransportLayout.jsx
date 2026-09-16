import { NavLink,Outlet,Navigate } from 'react-router-dom';
import { PageTitle,Empty } from '../components/SeafinUI';
import { useTransport } from './TransportContext';
export default function TransportLayout(){
  const {loading,error,actor}=useTransport();
  return <><PageTitle title="Transporte Escolar">Ocorrências, fiscalização dos serviços e avaliação mensal.</PageTitle><p className="local-notice">Operação local demonstrativa. Evidências e registros ficam neste navegador. O acesso escolar real depende de autenticação institucional e RLS; a prévia escolar não é uma barreira de segurança.</p>{actor.role==='seafin'&&<nav className="transport-nav" aria-label="Navegação de Transporte">{[['','Painel SEAFIN'],['escola','Área da escola'],['avaliacoes','Avaliação mensal'],['relatorios','Relatórios por período'],['configuracoes','Configurações']].map(([path,label])=><NavLink end key={path} to={`/painel/transporte${path?`/${path}`:''}`}>{label}</NavLink>)}</nav>}{loading?<Empty>Carregando registros locais…</Empty>:error?<p role="alert" className="error-box">{error}</p>:<Outlet/>}</>;
}
export function ManagerOnly({children}){const {actor}=useTransport();return actor.role==='seafin'?children:<Navigate to={`/painel/transporte/escola/${actor.schoolId||''}`} replace/>;}
