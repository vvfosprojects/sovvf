import { TriageSummary } from '../interface/triage-summary.interface';
import { NecessitaSoccorsoAereoEnum } from '../enum/necessita-soccorso-aereo.enum';

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

export function getSoccorsoAereoTriage(triageSummary: TriageSummary[]): { desc: NecessitaSoccorsoAereoEnum | string, value: number } {
    if (!!triageSummary) {
        let soccorsoAereoTriage: string;
        for (const summary of triageSummary) {
            const soccorsoAereo = summary.soccorsoAereo;
            if (soccorsoAereo) {
                soccorsoAereoTriage = soccorsoAereo;
            }
        }
        switch (soccorsoAereoTriage) {
            case NecessitaSoccorsoAereoEnum.NonNecessario:
                return {
                    desc: NecessitaSoccorsoAereoEnum.NonNecessario,
                    value: 1
                };
            case NecessitaSoccorsoAereoEnum.Utile:
                return {
                    desc: NecessitaSoccorsoAereoEnum.Utile,
                    value: 2
                };
            case NecessitaSoccorsoAereoEnum.MoltoUtile:
                return {
                    desc: NecessitaSoccorsoAereoEnum.MoltoUtile,
                    value: 3
                };
            case NecessitaSoccorsoAereoEnum.Indispensabile:
                return {
                    desc: NecessitaSoccorsoAereoEnum.Indispensabile,
                    value: 4
                };
        }
    }
    return {
        desc: 'Non Impostata',
        value: 0
    };
}
