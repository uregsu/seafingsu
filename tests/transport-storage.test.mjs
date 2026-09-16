import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';
import { executeTransport,readTransport,prepareEvidence,readEvidence } from '../src/transport/repository.js';
import { CONTRACTS,today } from '../src/transport/domain.js';
test('Arquivos são validados e gravados junto com a ocorrência; protocolos concorrentes não colidem',async()=>{
  const file=new File(['%PDF-1.4\n%%EOF'],'evidencia-teste.pdf',{type:'application/pdf'});
  const uploads=await prepareEvidence([file]);assert.equal(uploads[0].sha256.length,64);
  const draft={schoolId:'school-001',cie:'0001',contractId:CONTRACTS[0].id,date:today(),time:'10:00',vehicle:'Teste',driver:'Teste',place:'Teste',type:'Atraso',description:'Somente em memória de teste',severity:'Baixo',evidences:uploads.map(({blob:_blob,...meta})=>meta)};
  const actor={role:'school',schoolId:'school-001',name:'Teste'};
  const first=await executeTransport({type:'createOccurrence',data:draft},actor,uploads);
  assert.equal((await readEvidence(uploads[0].id)).blob.size,file.size);
  const results=await Promise.all([executeTransport({type:'createOccurrence',data:draft},actor),executeTransport({type:'createOccurrence',data:draft},actor)]);
  assert.notEqual(results[0].result.protocol,results[1].result.protocol);
  assert.equal((await readTransport()).occurrences.length,3);
  await assert.rejects(executeTransport({type:'createOccurrence',data:{...draft,type:'Outros'}},actor));
  assert.equal((await readTransport()).occurrences.length,3);
  assert.equal(first.result.evidences[0].sha256,uploads[0].sha256);
});
test('Upload rejeita tipo, assinatura, limite por arquivo e quantidade',async()=>{
  await assert.rejects(prepareEvidence([new File(['bad'],'fake.jpg',{type:'image/jpeg'})]));
  await assert.rejects(prepareEvidence([new File(['<html>'],'x.html',{type:'text/html'})]));
  await assert.rejects(prepareEvidence(Array.from({length:7},()=>new File(['%PDF-1.4'],'x.pdf',{type:'application/pdf'}))));
  await assert.rejects(prepareEvidence([new File([new Uint8Array(11*1024*1024)],'large.pdf',{type:'application/pdf'})]));
});
