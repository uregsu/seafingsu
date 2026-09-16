import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { filterItems, operationalAlerts, saveRecord, evidenceUrl } from '../src/data/operations.js';
import { mergeCompetencias } from '../src/services/importService.js';
const base = JSON.parse(fs.readFileSync(new URL('../src/data/fiscalizacoes.json', import.meta.url)));
test('Importação preserva três registros únicos e valores em centavos', () => {
  assert.equal(new Set(base.registros.map(r=>r.id)).size,3);
  assert.equal(base.registros.filter(r=>r.competencia==='2026-08').reduce((s,r)=>s+r.valor_total_a_pagar_centavos,0),225137515);
  for(const r of base.registros) assert.equal(r.valor_cronograma_centavos-r.valor_total_a_pagar_centavos,r.diferenca_centavos);
  assert.equal(base.registros.find(r=>r.competencia==='2026-07').preenchimento.sem_resposta,82);
});
test('Filtro escolar não atribui agregado regional a uma escola',()=>assert.equal(filterItems(base.registros,{school:'school-001'}).length,0));
test('Filtros combinam competência, módulo e situação',()=>assert.equal(filterItems(base.registros,{period:'2026-08',module:'merenda',status:'Finalizado'}).length,1));
test('Atualização mantém ID e histórico sem duplicar',()=>{
  const items=saveRecord([],{title:'Verificar entrega',kind:'ocorrencia',module:'merenda',evidence:'',status:'Aberta'},'teste','2026-09-01T12:00:00Z');
  const updated=saveRecord(items,{...items[0],status:'Resolvida'},'teste','2026-09-02T12:00:00Z');
  assert.equal(updated.length,1);assert.equal(updated[0].history.length,2);assert.equal(updated[0].createdAt,items[0].createdAt);assert.equal(items[0].status,'Aberta');
});
test('Prazos vencidos ignoram registros resolvidos e sem prazo',()=>{
  const alerts=operationalAlerts([{id:'1',deadline:'2026-08-01',status:'Aberta'},{id:'2',deadline:'2026-08-01',status:'Resolvida'},{id:'3',status:'Aberta'}],'2026-09-01');
  assert.equal(alerts.length,1);assert.equal(alerts[0].itemId,'1');
});
test('Evidências bloqueiam protocolos executáveis e campos obrigatórios',()=>{
  assert.equal(evidenceUrl('javascript:alert(1)'),null);assert.equal(evidenceUrl('https://example.org/arquivo'),'https://example.org/arquivo');
  assert.throws(()=>saveRecord([],{title:'',evidence:''},'teste'));assert.throws(()=>saveRecord([],{title:'teste',evidence:'data:text/html,bad'},'teste'));
});
test('Reimportação idempotente e conflitos não sobrescrevem a origem',()=>{
  const again=mergeCompetencias(base.registros,base.registros);assert.equal(again.records.length,3);assert.equal(again.conflicts.length,0);
  const changed=structuredClone(base.registros[0]);changed.valor_total_a_pagar_centavos++;
  const result=mergeCompetencias(base.registros,[changed]);assert.equal(result.conflicts.length,1);assert.equal(result.records.find(r=>r.id===changed.id).valor_total_a_pagar_centavos,100420197);
});
test('Nova competência preserva histórico e registra data da importação',()=>{
  const next=structuredClone(base.registros[0]);next.mes=9;next.competencia='2026-09';next.id=[next.ug,next.processo,next.contrato,next.ano,next.mes].join('|');
  const result=mergeCompetencias(base.registros,[next],'2026-09-16T12:00:00Z');assert.equal(result.records.length,4);assert.equal(result.records.find(r=>r.id===next.id).importedAt,'2026-09-16T12:00:00Z');
});
