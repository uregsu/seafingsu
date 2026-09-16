export function Empty({ children }) { return <div className="empty-state">{children}</div>; }
export function Metric({ title, value, note = '' }) { return <div className="metric"><span>{title}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>; }
export function PageTitle({ title, children }) { return <header className="page-title"><h2>{title}</h2><p>{children}</p></header>; }
