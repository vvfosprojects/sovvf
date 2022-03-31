import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../features/auth/store/auth.state';
import { TipoConcorrenzaEnum } from '../../../shared/enum/tipo-concorrenza.enum';
import { ConcorrenzaState } from '../../../shared/store/states/concorrenza/concorrenza.state';
import { ConcorrenzaInterface } from '../../../shared/interface/concorrenza.interface';

@Injectable({
    providedIn: 'root'
})
export class LockedConcorrenzaService {

    constructor(private store: Store) {
    }

    getLockedConcorrenza(type: TipoConcorrenzaEnum, value: string[]): string {
        const currentUser = this.store.selectSnapshot(AuthState.currentUser);
        const concorrenza = this.store.selectSnapshot(ConcorrenzaState.concorrenza) as ConcorrenzaInterface[];
        let concorrenzaFound: ConcorrenzaInterface;
        let blocks: TipoConcorrenzaEnum[];
        switch (type) {
            case TipoConcorrenzaEnum.Richiesta: // TODO: implementare nel DOM
                // TODO: completare e rianalizzare, potrebbe essere inutile
                blocks = [];
                break;
            case TipoConcorrenzaEnum.Mezzo: // TODO: implementare nel DOM
                blocks = [
                    TipoConcorrenzaEnum.Mezzo
                ];
                break;
            case TipoConcorrenzaEnum.Squadra: // TODO: implementare nel DOM
                blocks = [
                    TipoConcorrenzaEnum.Squadra
                ];
                break;
            case TipoConcorrenzaEnum.ChiusuraChiamata:
                blocks = [
                    TipoConcorrenzaEnum.ChiusuraChiamata,
                    TipoConcorrenzaEnum.Trasferimento,
                    TipoConcorrenzaEnum.Sganciamento,
                    TipoConcorrenzaEnum.Modifica,
                    TipoConcorrenzaEnum.InvioPartenza
                ];
                break;
            case TipoConcorrenzaEnum.ChiusuraIntervento:
                blocks = [
                    TipoConcorrenzaEnum.ChiusuraChiamata,
                    TipoConcorrenzaEnum.Trasferimento,
                    TipoConcorrenzaEnum.Sganciamento,
                    TipoConcorrenzaEnum.Modifica,
                    TipoConcorrenzaEnum.InvioPartenza
                ];
                break;
            case TipoConcorrenzaEnum.Modifica:
                blocks = [
                    TipoConcorrenzaEnum.Modifica,
                    TipoConcorrenzaEnum.ChiusuraChiamata,
                    TipoConcorrenzaEnum.ChiusuraIntervento,
                    TipoConcorrenzaEnum.Trasferimento
                ];
                break;
            case TipoConcorrenzaEnum.Trasferimento:
                blocks = [
                    TipoConcorrenzaEnum.Trasferimento,
                    TipoConcorrenzaEnum.ChiusuraChiamata,
                    TipoConcorrenzaEnum.ChiusuraIntervento,
                    TipoConcorrenzaEnum.Sganciamento,
                    TipoConcorrenzaEnum.InvioPartenza
                ];
                break;
            case TipoConcorrenzaEnum.InvioPartenza:
                blocks = [
                    TipoConcorrenzaEnum.InvioPartenza,
                    TipoConcorrenzaEnum.Trasferimento,
                    TipoConcorrenzaEnum.ChiusuraChiamata,
                    TipoConcorrenzaEnum.ChiusuraIntervento
                ];
                break;
            case TipoConcorrenzaEnum.Allerta:
                blocks = [
                    TipoConcorrenzaEnum.Allerta,
                    TipoConcorrenzaEnum.Trasferimento,
                    TipoConcorrenzaEnum.ChiusuraChiamata,
                    TipoConcorrenzaEnum.ChiusuraIntervento
                ];
                break;
            case TipoConcorrenzaEnum.CambioStatoPartenza: // TODO: implementare nel DOM
                blocks = [
                    TipoConcorrenzaEnum.CambioStatoPartenza,
                    TipoConcorrenzaEnum.ChiusuraChiamata,
                    TipoConcorrenzaEnum.ChiusuraIntervento,
                    TipoConcorrenzaEnum.GestisciPartenza
                ];
                break;
            case TipoConcorrenzaEnum.GestisciPartenza: // TODO: implementare nel DOM
                blocks = [
                    TipoConcorrenzaEnum.GestisciPartenza,
                    TipoConcorrenzaEnum.ChiusuraChiamata,
                    TipoConcorrenzaEnum.ChiusuraIntervento
                ];
                break;
            case TipoConcorrenzaEnum.Sganciamento: // TODO: implementare nel DOM
                blocks = [
                    TipoConcorrenzaEnum.Sganciamento,
                    TipoConcorrenzaEnum.ChiusuraChiamata,
                    TipoConcorrenzaEnum.ChiusuraIntervento,
                    TipoConcorrenzaEnum.Trasferimento
                ];
                break;
            case TipoConcorrenzaEnum.RegistrazioneSchedaContatto: // TODO: implementare nel DOM
                blocks = [
                    TipoConcorrenzaEnum.RegistrazioneSchedaContatto
                ];
                break;
            case TipoConcorrenzaEnum.ModificaPos: // TODO: implementare nel DOM
                blocks = [
                    TipoConcorrenzaEnum.ModificaPos,
                    TipoConcorrenzaEnum.EliminaPos
                ];
                break;
            case TipoConcorrenzaEnum.EliminaPos: // TODO: implementare nel DOM
                blocks = [
                    TipoConcorrenzaEnum.EliminaPos,
                    TipoConcorrenzaEnum.ModificaPos
                ];
                break;
            case TipoConcorrenzaEnum.ModificaPianiDiscendenti: // TODO: implementare nel DOM
                blocks = [
                    TipoConcorrenzaEnum.ModificaPianiDiscendenti,
                    TipoConcorrenzaEnum.EliminaPianiDiscendenti
                ];
                break;
            case TipoConcorrenzaEnum.EliminaPianiDiscendenti: // TODO: implementare nel DOM
                blocks = [
                    TipoConcorrenzaEnum.EliminaPianiDiscendenti,
                    TipoConcorrenzaEnum.ModificaPianiDiscendenti
                ];
                break;
            case TipoConcorrenzaEnum.ModificaDettaglioTipologia: // TODO: implementare nel DOM
                // TODO: completare e rianalizzare, coinvolge anche il triage
                blocks = [
                    TipoConcorrenzaEnum.ModificaDettaglioTipologia,
                    TipoConcorrenzaEnum.EliminaDettaglioTipologia
                ];
                break;
            case TipoConcorrenzaEnum.EliminaDettaglioTipologia: // TODO: implementare nel DOM
                // TODO: completare e rianalizzare, coinvolge anche il triage
                blocks = [
                    TipoConcorrenzaEnum.EliminaDettaglioTipologia,
                    TipoConcorrenzaEnum.ModificaDettaglioTipologia
                ];
                break;
            case TipoConcorrenzaEnum.ModificaTriage: // TODO: implementare nel DOM
                // TODO: completare e rianalizzare, coinvolge anche il dettaglio tipologia
                blocks = [
                    TipoConcorrenzaEnum.ModificaTriage,
                    TipoConcorrenzaEnum.EliminaTriage
                ];
                break;
            case TipoConcorrenzaEnum.EliminaTriage: // TODO: implementare nel DOM
                // TODO: completare e rianalizzare, coinvolge anche il dettaglio tipologia
                blocks = [
                    TipoConcorrenzaEnum.EliminaTriage,
                    TipoConcorrenzaEnum.ModificaTriage
                ];
                break;
            case TipoConcorrenzaEnum.AggiungiRuoloUtente: // TODO: implementare nel DOM
                blocks = [
                    TipoConcorrenzaEnum.AggiungiRuoloUtente
                ];
                break;
            case TipoConcorrenzaEnum.Fonogramma: // TODO: implementare nel DOM
                // TODO: completare blocks
                break;
            case TipoConcorrenzaEnum.EntiIntervenuti: // TODO: implementare nel DOM
                // TODO: completare blocks
                break;
            case TipoConcorrenzaEnum.RiapriChiamataIntervento: // TODO: implementare nel DOM
                // TODO: completare blocks
                break;
        }
        concorrenzaFound = concorrenza?.filter((c: ConcorrenzaInterface) => blocks.includes(c.type) && value.includes(c.value) && c.idOperatore !== currentUser.id)[0];
        return concorrenzaFound ? concorrenzaFound.nominativoOperatore : null;
    }
}
