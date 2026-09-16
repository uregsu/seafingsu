import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, UserRound, LockKeyhole, LoaderCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const from = location.state?.from;
  const destination = typeof from === 'string' && /^\/painel(?:[/?#]|$)/.test(from) ? from : '/painel';

  if (isAuthenticated) return <Navigate to={destination} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar. Tente novamente.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 disabled:opacity-60';
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-100 p-4 sm:p-8">
      <section aria-labelledby="login-title" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-10">
        <div className="mb-6 inline-flex rounded-2xl bg-blue-700 p-3 text-white"><ShieldCheck size={30} aria-hidden="true" /></div>
        <h1 id="login-title" className="text-2xl font-bold tracking-tight text-slate-900">HUB SEAFIN</h1>
        <p className="mt-1 text-sm text-slate-500">URE Guarulhos Sul</p>
        <p className="mb-8 mt-6 text-sm text-slate-600">Entre com suas credenciais para acessar o painel.</p>
        <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700">Usuário</label>
            <div className="relative">
              <UserRound size={18} className="absolute left-4 top-4 text-slate-400" aria-hidden="true" />
              <input id="username" name="username" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required disabled={loading} value={username} onChange={e => setUsername(e.target.value)} className={inputClass} aria-invalid={Boolean(error)} aria-describedby={error ? 'login-error' : undefined} />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Senha</label>
            <div className="relative">
              <LockKeyhole size={18} className="absolute left-4 top-4 text-slate-400" aria-hidden="true" />
              <input id="password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" required disabled={loading} value={password} onChange={e => setPassword(e.target.value)} className={`${inputClass} pr-14`} aria-invalid={Boolean(error)} aria-describedby={error ? 'login-error' : undefined} />
              <button type="button" onClick={() => setVisible(v => !v)} aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'} aria-controls="password" aria-pressed={visible} className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600">
                {visible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && <p id="login-error" role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60">
            {loading && <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />}
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">Ambiente de demonstração • Autenticação simulada</p>
      </section>
    </main>
  );
}
