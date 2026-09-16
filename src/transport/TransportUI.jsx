import { CONTRACTS, csvCell } from './domain';
export const contractName=id=>CONTRACTS.find(c=>c.id===id)?.number||'Não informado';
export function Bars({title,entries,label=value=>value}){const max=Math.max(1,...entries.map(([,n])=>n));return <section className="panel"><h3>{title}</h3>{!entries.length?<p className="muted">Sem registros no período.</p>:entries.map(([key,n])=><div className="transport-bar" key={key}><span>{label(key)}</span><div><i style={{width:`${n/max*100}%`}}/></div><strong>{n}</strong></div>)}</section>;}
export function DownloadCSV({rows,headers,name='transporte.csv',children}) {
  function download(){const csv='\ufeff'+[headers,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  return <button className="secondary" onClick={download}>{children||'Exportar CSV'}</button>;
}
