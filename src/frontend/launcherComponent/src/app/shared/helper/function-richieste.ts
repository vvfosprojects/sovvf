import { StatoRichiesta } from '../enum/stato-richiesta.enum';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';
import { StatoRichiestaActions } from '../enum/stato-richiesta-actions.enum';
import { Tipologia } from '../model/tipologia.model';

export function makeIDChiamata(): string {
    let text = '';
    const stringLength = 2;
    const possible = '123456789';

    for (let i = 0; i < stringLength; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return `RM-0${text}`;
}

export function wipeStatoRichiesta(stato: StatoRichiesta): string {
    const stati: [StatoRichiesta, string][] = [
        [StatoRichiesta.Chiamata, 'chiamate'],
        [StatoRichiesta.Sospesa, 'sospesi'],
        [StatoRichiesta.Assegnata, 'assegnati'],
        [StatoRichiesta.Presidiata, 'presidiati'],
        [StatoRichiesta.Chiusa, 'chiusi']
    ];
    const mapTipoStato: Map<StatoRichiesta, string> = new Map(stati);

    return mapTipoStato.get(stato);
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

export function visualizzaBoschiSterpaglie(tipologieRichiesta: Tipologia[]): boolean {
    let count = 0;
    let visualizza = false;
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
