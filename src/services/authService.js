const KEY = 'hub-seafin:mock-session';
const USERNAME = 'gsu.seafin.educacao.sp.gov.br';

// Somente protótipo. Substitua este serviço por autenticação no servidor.
export async function authenticate(username, password) {
  if (username !== USERNAME || password !== 'Guarulhossul123!') {
    throw new Error('Usuário ou senha inválidos.');
  }
  return { token: `mock-${crypto.randomUUID()}`, user: { username } };
}

export function readSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(KEY));
    return session?.user?.username === USERNAME &&
      typeof session.token === 'string' && session.token.startsWith('mock-')
      ? session : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    throw new Error('Não foi possível iniciar a sessão. Verifique as permissões de armazenamento do navegador.');
  }
}

export function clearSession() {
  sessionStorage.removeItem(KEY);
}
