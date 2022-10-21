import { StatoRichiesta } from '../enum/stato-richiesta.enum';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';
import { StatoRichiestaActions } from '../enum/stato-richiesta-actions.enum';
import { Tipologia } from '../model/tipologia.model';
import { Partenza } from '../model/partenza.model';
import { Utente } from '../model/utente.model';
import { makeID } from './function-generiche';
import { MezzoRientratoVisibileRichiesta } from '../interface/mezzo-rientrato-visibile-richiesta.interface';
import { InfoMezzo } from '../store/states/loading/loading.state';

export function makeIdChiamata(operatore: Utente, sedeSelezionata: string): string {
    return `${sedeSelezionata}-${operatore.id}-${makeID(8)}`;
}

export function calcolaActionSuggeritaRichiesta(richiesta: SintesiRichiesta): StatoRichiestaActions {
    switch (richiesta.stato) {
        case StatoRichiesta.Chiusa:
            return StatoRichiestaActions.Riaperta;
        default:
            return StatoRichiestaActions.Chiusa;
    }
}

export function statoRichiestaActionsEnumToStringArray(exceptStato?: string[]): StatoRichiestaActions[] {
    let statiRichiestaString = [];
    for (const val in StatoRichiestaActions) {
        if (typeof StatoRichiestaActions[val] === 'string') {
            statiRichiestaString.push(StatoRichiestaActions[val]);
        }
    }
    // se c'è un'eccezione filtro l'array eliminando lo stato
    if (exceptStato && exceptStato.length > 0) {
        exceptStato.forEach((stato: string) => {
            statiRichiestaString = statiRichiestaString.filter((s: string) => s !== stato);
        });
    }
    return statiRichiestaString;
}

export function statoRichiestaColor(stato: string): string {
    let color = '';
    switch (stato) {
        case StatoRichiesta.Chiusa:
            color = 'secondary';
            break;
        case StatoRichiesta.Assegnata:
            color = 'info';
            break;
        case StatoRichiesta.Presidiata:
            color = 'success';
            break;
        case StatoRichiesta.Sospesa:
            color = 'warning';
            break;
        case StatoRichiesta.Chiamata:
            color = 'danger';
            break;
    }
    return color;
}

export function defineChiamataIntervento(codice: string, codiceRichiesta: string): string {
    if (!codiceRichiesta) {
        return 'Chiamata';
    } else {
        return 'Intervento';
    }
}

// TODO: valutare utilità
export function visualizzaBoschiSterpaglie(tipologieRichiesta: Tipologia[]): boolean {
    let count = 0;
    let visualizza: boolean;
    if (tipologieRichiesta) {
        tipologieRichiesta.forEach((tipologia: Tipologia) => {
            if (tipologia.boschivo) {
                count++;
            }
        });
    }
    count <= 0 ? visualizza = false : visualizza = true;
    return visualizza;
}

export function checkNumeroPartenzeAttive(partenze: Partenza[], codMezziRientratiVisibili?: MezzoRientratoVisibileRichiesta, annullaStatoMezzoRientrato?: InfoMezzo): number {
    let count = 0;
    if (partenze && partenze.length > 0) {
        const partenzeNew = getUniqueLastPartenze(partenze);
        partenzeNew.forEach((p: Partenza) => {
            if ((!p.partenza.sganciata && !p.partenza.partenzaAnnullata) || codMezziRientratiVisibili?.codMezzi?.includes(p.partenza.mezzo.codice) || annullaStatoMezzoRientrato?.codMezzo === p.partenza.mezzo.codice) {
                count++;
            }
        });
    }
    return count;
}

export function getPartenzeAttive(partenze: Partenza[], codMezziRientratiVisibili?: MezzoRientratoVisibileRichiesta, annullaStatoMezzoRientrato?: InfoMezzo): Partenza[] {
    const partenzeNew = getUniqueLastPartenze(partenze);
    return partenzeNew.filter((p: Partenza) => (!p.partenza.sganciata && !p.partenza.partenzaAnnullata) || codMezziRientratiVisibili?.codMezzi?.includes(p.partenza.mezzo.codice) || annullaStatoMezzoRientrato?.codMezzo === p.partenza.mezzo.codice);
}

function getUniqueLastPartenze(partenze: Partenza[]): Partenza[] {
    const partenzeNew = [] as Partenza[];
    partenze.forEach((p: Partenza) => {
        const partenzaAlreadyExists = partenzeNew.filter((x: Partenza) => x.partenza.mezzo.codice === p.partenza.mezzo.codice)?.length;
        if (partenzaAlreadyExists) {
            const indexPartenzaAlreadyExists = partenzeNew.findIndex((x: Partenza) => x.partenza.mezzo.codice === p.partenza.mezzo.codice);
            partenzeNew.splice(indexPartenzaAlreadyExists, 1);
        }
        partenzeNew.push(p);
    });
    return partenzeNew;
}
