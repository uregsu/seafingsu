/** Contratos de integração; IDs locais de escola precisam ser resolvidos para public.schools.id pelo internal_code. */
export type Module = 'merenda' | 'limpeza' | 'transporte' | 'cuidador';
export interface ImportedSource { arquivo: string; sha256: string; aba: string; intervalo: string; importedAt?: string | null; }
export interface SchoolReference { id: string; name: string; cie: string | null; slug: string; }
export interface TransportRecord {
  id: string; schoolId: string; competencia: string; studentCount: number | null;
  route: string | null; modality: string | null; contract: string | null; company: string | null;
  vehicle: string | null; validFrom: string | null; validUntil: string | null;
  amountCents: number | null; status: string | null; source: ImportedSource;
}
export interface CareProcess {
  id: string; schoolId: string; sei: string | null; studentReference: string | null;
  requestType: string; requestDate: string | null; receivedDate: string | null;
  stage: string; responsible: string | null; provider: string | null; serviceStart: string | null;
  deadline: string | null; nextAction: string | null; description: string; evidence: string | null;
}
export interface PermissionContext { role: 'regional_admin' | 'seafin' | 'management' | 'school'; schoolId?: string; }
export interface Repository<T> { list(): Promise<T[]>; save(record: T): Promise<T>; }
