import { PosInterface, TipologiaPos } from '../interface/pos.interface';
import { Tipologia } from '../model/tipologia.model';
import { DettaglioTipologia } from '../interface/dettaglio-tipologia.interface';

export function getTipologieFromListaTipologie(pos: PosInterface, tipologie: Tipologia[]): Tipologia[] {
    const tipologieFromListaTipologie = [];
    pos?.listaTipologie?.forEach((tipologiaPos: TipologiaPos) => {
        const tipologiaTrovata = tipologieFromListaTipologie?.filter((t: Tipologia) => t?.codice === '' + tipologiaPos?.codTipologia)[0];
        if (!tipologiaTrovata) {
            const tipologia = tipologie?.filter((t: Tipologia) => t?.codice === '' + tipologiaPos?.codTipologia)[0];
            tipologieFromListaTipologie.push(tipologia);
        }
    });
    return tipologieFromListaTipologie;
}

export function getDettagliTipologieFromListaTipologie(pos: PosInterface, dettagliTipologie: DettaglioTipologia[]): DettaglioTipologia[] {
    const dettagliTipologieFromListaTipologie = [];
    const objsToFound = [];

    if (dettagliTipologie?.length) {
        pos?.listaTipologie?.forEach((tipologiaPos: TipologiaPos) => {
            tipologiaPos.codTipologiaDettaglio.forEach((codTipologiaDettaglio: number) => {
                objsToFound.push({ codTipologia: tipologiaPos.codTipologia, codDettaglio: codTipologiaDettaglio });
            });
        });

        objsToFound.forEach((objToFound) => {
            const dettaglioTrovato = dettagliTipologie.filter((dettaglio: DettaglioTipologia) => dettaglio.codiceTipologia === objToFound.codTipologia && dettaglio.codiceDettaglioTipologia === objToFound.codDettaglio)[0];
            dettagliTipologieFromListaTipologie.push(dettaglioTrovato);
        });
    }

    return dettagliTipologieFromListaTipologie;
}
