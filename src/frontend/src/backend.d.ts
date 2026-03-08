import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Symptom {
    name: string;
    severity: bigint;
}
export interface PeriodEntry {
    id: bigint;
    endDate: string;
    createdAt: bigint;
    notes: string;
    symptoms: Array<Symptom>;
    startDate: string;
}
export interface backendInterface {
    addPeriodEntry(startDate: string, endDate: string, notes: string): Promise<bigint>;
    addSymptomToEntry(entryId: bigint, symptomName: string, severity: bigint): Promise<boolean>;
    deletePeriodEntry(id: bigint): Promise<boolean>;
    getAllPeriodEntries(): Promise<Array<PeriodEntry>>;
    removeSymptomFromEntry(entryId: bigint, symptomName: string): Promise<boolean>;
    updatePeriodEntry(id: bigint, startDate: string, endDate: string, notes: string): Promise<boolean>;
    updateSymptomSeverity(entryId: bigint, symptomName: string, severity: bigint): Promise<boolean>;
}
