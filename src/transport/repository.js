import { initialState, applyCommand } from './domain.js';
let connection;
function database() {
  if (!connection) connection=new Promise((resolve,reject)=>{
    const request=indexedDB.open('seafin-transporte-v1',1);
    request.onupgradeneeded=()=>{request.result.createObjectStore('state');request.result.createObjectStore('files',{keyPath:'id'});};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>{connection=null;reject(Error('Não foi possível abrir o armazenamento local de Transporte.'));};
  });
  return connection;
}
export async function readTransport() {
  const db=await database();return new Promise((resolve,reject)=>{const r=db.transaction('state').objectStore('state').get('current');r.onsuccess=()=>resolve(r.result||initialState());r.onerror=()=>reject(r.error);});
}
export async function executeTransport(command,actor,files=[]) {
  const db=await database();return new Promise((resolve,reject)=>{
    const tx=db.transaction(['state','files'],'readwrite');let output;let failure;
    const store=tx.objectStore('state');const request=store.get('current');
    request.onsuccess=()=>{try{output=applyCommand(request.result||initialState(),command,actor);store.put(output.state,'current');for(const file of files)tx.objectStore('files').put(file);}catch(err){failure=err;tx.abort();}};
    tx.oncomplete=()=>resolve(output);tx.onabort=()=>reject(failure||Error('Não foi possível salvar. Verifique o espaço disponível no navegador.'));tx.onerror=()=>{failure=tx.error;};
  });
}
export async function readEvidence(id) {const db=await database();return new Promise((resolve,reject)=>{const r=db.transaction('files').objectStore('files').get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export const ACCEPT='image/jpeg,image/png,image/webp,video/mp4,video/webm,application/pdf';
export async function prepareEvidence(input) {
  const files=Array.from(input);if(files.length>6)throw Error('Máximo de 6 arquivos por ocorrência.');
  if(files.reduce((s,f)=>s+f.size,0)>100*1024*1024)throw Error('O conjunto de evidências deve ter até 100 MB.');
  const prepared=[];
  for(const file of files){
    const limit=file.type.startsWith('video/')?50:10;
    if(!ACCEPT.split(',').includes(file.type)||!file.size||file.size>limit*1024*1024)throw Error(`Arquivo ${file.name}: formato não aceito ou tamanho acima de ${limit} MB.`);
    const bytes=new Uint8Array(await file.arrayBuffer());const text=new TextDecoder().decode(bytes.slice(0,16));
    const valid=file.type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:file.type==='image/png'?bytes[0]===137&&text.slice(1,4)==='PNG':file.type==='image/webp'?text.startsWith('RIFF')&&text.slice(8,12)==='WEBP':file.type==='video/mp4'?text.slice(4,8)==='ftyp':file.type==='video/webm'?bytes[0]===26&&bytes[1]===69&&bytes[2]===223&&bytes[3]===163:text.startsWith('%PDF-');
    if(!valid)throw Error(`Conteúdo de ${file.name} não corresponde ao formato declarado.`);
    const sha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(n=>n.toString(16).padStart(2,'0')).join('');
    prepared.push({id:crypto.randomUUID(),name:file.name,type:file.type,size:file.size,sha256,uploadedAt:new Date().toISOString(),blob:file});
  }
  return prepared;
}
