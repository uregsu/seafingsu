import { createContext,useContext,useEffect,useState,useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { initialState } from './domain';
import { readTransport,executeTransport } from './repository';
const Context=createContext(null);
export function TransportProvider({children}) {
  const {user}=useAuth();const [state,setState]=useState(initialState);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
  // O usuário atual é o mock regional. Um perfil escolar futuro deve fornecer role e schoolId autenticados no servidor.
  const actor={role:user?.role==='school'?'school':'seafin',schoolId:user?.schoolId||null,name:user?.username||'Usuário local'};
  const refresh=useCallback(async()=>{try{setState(await readTransport());setError('');}catch(err){setError(err.message);}finally{setLoading(false);}},[]);
  useEffect(()=>{refresh();const channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel('seafin-transporte'):null;if(channel)channel.onmessage=refresh;window.addEventListener('focus',refresh);return()=>{channel?.close();window.removeEventListener('focus',refresh);};},[refresh]);
  async function execute(command,files=[],schoolId=null) {
    const context=schoolId?{...actor,role:'school',schoolId:actor.role==='school'?actor.schoolId:schoolId}:actor;
    const output=await executeTransport(command,context,files);setState(output.state);
    if(typeof BroadcastChannel!=='undefined'){const channel=new BroadcastChannel('seafin-transporte');channel.postMessage('updated');channel.close();}
    return output.result;
  }
  return <Context.Provider value={{state,actor,execute,loading,error,refresh}}>{children}</Context.Provider>;
}
export const useTransport=()=>useContext(Context);
