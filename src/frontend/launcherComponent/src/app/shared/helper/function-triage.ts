import { TriageSummary } from '../interface/triage-summary.interface';

export function getGeneriMezzoTriageSummary(summary: TriageSummary[]): string[] {
    let generiMezzoResult: string[];
    if (!!summary && summary?.length) {
        for (const s of summary) {
            if (s?.generiMezzo?.length) {
                generiMezzoResult = s.generiMezzo;
            }
        }
    }
    return generiMezzoResult ? generiMezzoResult : null;
}

export function getContatoreGeneriMezzo(summary: TriageSummary[]): number {
    let count = 0;
    if (!!summary && summary?.length) {
        for (const s of summary) {
            if (s?.generiMezzo?.length) {
                count = s.generiMezzo.length;
            }
        }
    }
    return count;
}

export function getNoteOperatoreTriageSummary(summary: TriageSummary[]): string[] {
    if (!!summary && summary?.length) {
        const note = [];
        summary.forEach((s: TriageSummary) => {
            const noteOperatore = s.noteOperatore;
            if (noteOperatore) {
                note.push(noteOperatore);
            }
        });
        return note;
    }
}

export function getPrioritaTriage(summary: TriageSummary[]): string {
    let prioritaConsigliata = null;
    if (!!summary && summary?.length) {
        for (const s of summary) {
            if (s?.prioritaConsigliata) {
                prioritaConsigliata = s.prioritaConsigliata;
            }
        }
    }
    return prioritaConsigliata;
}
