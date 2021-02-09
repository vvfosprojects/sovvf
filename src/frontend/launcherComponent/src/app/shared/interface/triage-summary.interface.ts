import { ItemTriageData } from './item-triage-data.interface';
import { RispostaTriage } from './risposta-triage.interface';

export interface TriageSummary extends ItemTriageData, RispostaTriage {
    // utilizzata per salvare il riassunto del Triage nella Richiesta di Assistenza
}
