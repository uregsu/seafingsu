// Mesma chave do extrator original. Novas competências são acrescentadas, nunca substituídas.
export function mergeCompetencias(current, incoming, importedAt = new Date().toISOString()) {
  const records = new Map(current.map(r => [r.id, structuredClone(r)]));
  const conflicts = [];
  for (const original of incoming) {
    const record = structuredClone(original);
    const expectedId = [record.ug, record.processo, record.contrato, record.ano, record.mes].join('|');
    if (record.id !== expectedId || !Array.isArray(record.fontes) || !record.fontes.length) throw Error('Registro sem chave ou fonte válida.');
    for (const key of ['valor_cronograma_centavos', 'valor_total_a_pagar_centavos', 'diferenca_centavos']) {
      if (!Number.isSafeInteger(record[key])) throw Error('Valor monetário inválido; use centavos inteiros.');
    }
    const old = records.get(record.id);
    if (!old) { records.set(record.id, { ...record, importedAt }); continue; }
    const canonical = value => JSON.stringify(Object.fromEntries(Object.entries(value).filter(([key]) => !['fontes','importedAt'].includes(key)).sort(([a],[b]) => a.localeCompare(b))));
    if (canonical(old) !== canonical(record)) { conflicts.push({ id: record.id, original: old, received: record }); continue; }
    old.fontes = [...new Map([...old.fontes, ...record.fontes].map(f => [`${f.arquivo}|${f.sha256}|${f.aba}|${f.intervalo}`, f])).values()];
  }
  return { records: [...records.values()].sort((a,b) => a.competencia.localeCompare(b.competencia)), conflicts };
}
