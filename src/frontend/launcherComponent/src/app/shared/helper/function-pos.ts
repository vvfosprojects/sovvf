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
    pos?.listaTipologie?.forEach((tipologiaPos: TipologiaPos) => {
        tipologiaPos?.codTipologiaDettaglio?.forEach((codTipologiaDettaglio: number) => {
            const dettaglioTipologiaTrovato = dettagliTipologieFromListaTipologie?.filter((dT: DettaglioTipologia) => dT?.codiceDettaglioTipologia === tipologiaPos?.codTipologia)[0];
            if (!dettaglioTipologiaTrovato) {
                const dettaglioTipologia = dettagliTipologie?.filter((dT: DettaglioTipologia) => dT?.codiceTipologia === tipologiaPos?.codTipologia && dT?.codiceDettaglioTipologia === codTipologiaDettaglio)[0];
                dettagliTipologieFromListaTipologie.push(dettaglioTipologia);
            }
        });
    });
    return dettagliTipologieFromListaTipologie;
}
