import { TriageSummary } from '../interface/triage-summary.interface';

export function getGeneriMezzoTriageSummary(summary: TriageSummary[]): string[] {
    let generiMezzoResult: string[];
    if (summary?.length) {
        for (const s of summary) {
            if (s?.generiMezzo?.length) {
                for (const genereMezzo of s?.generiMezzo) {
                    if (!generiMezzoResult) {
                        generiMezzoResult = [];
                    }
                    const genereMezzoFound = generiMezzoResult.filter((gMezzo: string) => gMezzo === genereMezzo)[0];
                    if (!genereMezzoFound) {
                        generiMezzoResult.push(genereMezzo);
                    }
                }
            }
        }
    }
    return generiMezzoResult ? generiMezzoResult : null;
}

export function getContatoreGeneriMezzo(summary: TriageSummary[]): number {
    let count = 0;
    if (summary?.length) {
        for (const s of summary) {
            if (s?.generiMezzo?.length) {
                for (const genereMezzo of s?.generiMezzo) {
                    count = count + 1;
                }
            }
        }
    }
    return count;
}
