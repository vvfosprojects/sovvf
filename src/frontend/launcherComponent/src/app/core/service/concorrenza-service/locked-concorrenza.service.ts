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
            // TODO: non implementato, potrebbe non servire
            case TipoConcorrenzaEnum.Richiesta:
                blocks = [];
                break;
            case TipoConcorrenzaEnum.Mezzo:
                blocks = [
                    TipoConcorrenzaEnum.Mezzo
                ];
                break;
            case TipoConcorrenzaEnum.Squadra:
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
            case TipoConcorrenzaEnum.CambioStatoPartenza:
                blocks = [
                    TipoConcorrenzaEnum.CambioStatoPartenza,
                    TipoConcorrenzaEnum.ChiusuraChiamata,
                    TipoConcorrenzaEnum.ChiusuraIntervento,
                    TipoConcorrenzaEnum.GestisciPartenza
                ];
                break;
            case TipoConcorrenzaEnum.GestisciPartenza:
                blocks = [
                    TipoConcorrenzaEnum.GestisciPartenza,
                    TipoConcorrenzaEnum.CambioStatoPartenza,
                    TipoConcorrenzaEnum.ChiusuraChiamata,
                    TipoConcorrenzaEnum.ChiusuraIntervento
                ];
                break;
            case TipoConcorrenzaEnum.Sganciamento:
                blocks = [
                    TipoConcorrenzaEnum.Sganciamento,
                    TipoConcorrenzaEnum.ChiusuraChiamata,
                    TipoConcorrenzaEnum.ChiusuraIntervento,
                    TipoConcorrenzaEnum.Trasferimento
                ];
                break;
            case TipoConcorrenzaEnum.RegistrazioneSchedaContatto:
                blocks = [
                    TipoConcorrenzaEnum.RegistrazioneSchedaContatto
                ];
                break;
            case TipoConcorrenzaEnum.ModificaPos:
                blocks = [
                    TipoConcorrenzaEnum.ModificaPos,
                    TipoConcorrenzaEnum.EliminaPos
                ];
                break;
            case TipoConcorrenzaEnum.EliminaPos:
                blocks = [
                    TipoConcorrenzaEnum.EliminaPos,
                    TipoConcorrenzaEnum.ModificaPos
                ];
                break;
            case TipoConcorrenzaEnum.ModificaPianiDiscendenti:
                blocks = [
                    TipoConcorrenzaEnum.ModificaPianiDiscendenti,
                    TipoConcorrenzaEnum.EliminaPianiDiscendenti
                ];
                break;
            case TipoConcorrenzaEnum.EliminaPianiDiscendenti:
                blocks = [
                    TipoConcorrenzaEnum.EliminaPianiDiscendenti,
                    TipoConcorrenzaEnum.ModificaPianiDiscendenti
                ];
                break;
            case TipoConcorrenzaEnum.ModificaDettaglioTipologia:
                blocks = [
                    TipoConcorrenzaEnum.ModificaDettaglioTipologia,
                    TipoConcorrenzaEnum.EliminaDettaglioTipologia
                ];
                break;
            case TipoConcorrenzaEnum.EliminaDettaglioTipologia:
                blocks = [
                    TipoConcorrenzaEnum.EliminaDettaglioTipologia,
                    TipoConcorrenzaEnum.ModificaDettaglioTipologia,
                    TipoConcorrenzaEnum.ModificaTriage,
                    TipoConcorrenzaEnum.EliminaTriage
                ];
                break;
            case TipoConcorrenzaEnum.ModificaTriage:
                blocks = [
                    TipoConcorrenzaEnum.ModificaTriage,
                    TipoConcorrenzaEnum.EliminaTriage,
                    TipoConcorrenzaEnum.ModificaDettaglioTipologia,
                    TipoConcorrenzaEnum.EliminaDettaglioTipologia
                ];
                break;
            case TipoConcorrenzaEnum.EliminaTriage:
                blocks = [
                    TipoConcorrenzaEnum.EliminaTriage,
                    TipoConcorrenzaEnum.ModificaTriage,
                    TipoConcorrenzaEnum.ModificaDettaglioTipologia,
                    TipoConcorrenzaEnum.EliminaDettaglioTipologia
                ];
                break;
            case TipoConcorrenzaEnum.AggiungiRuoloUtente:
                blocks = [
                    TipoConcorrenzaEnum.AggiungiRuoloUtente,
                    TipoConcorrenzaEnum.EliminaUtente
                ];
                break;
            case TipoConcorrenzaEnum.EliminaRuoloUtente:
                blocks = [
                    TipoConcorrenzaEnum.EliminaUtente,
                    TipoConcorrenzaEnum.AggiungiRuoloUtente
                ];
                break;
            case TipoConcorrenzaEnum.ModificaRuoloUtente:
                blocks = [
                    TipoConcorrenzaEnum.ModificaRuoloUtente,
                    TipoConcorrenzaEnum.EliminaUtente
                ];
                break;
            case TipoConcorrenzaEnum.EliminaUtente:
                blocks = [
                    TipoConcorrenzaEnum.EliminaUtente,
                    TipoConcorrenzaEnum.AggiungiRuoloUtente,
                    TipoConcorrenzaEnum.EliminaRuoloUtente,
                    TipoConcorrenzaEnum.ModificaRuoloUtente
                ];
                break;
            case TipoConcorrenzaEnum.Sostituzione: // TODO: implementare nel DOM
                // TODO: completare blocks
                break;
            case TipoConcorrenzaEnum.Fonogramma: // TODO: implementare nel DOM
                // TODO: completare blocks
                break;
            case TipoConcorrenzaEnum.EntiIntervenuti: // TODO: implementare nel DOM
                // TODO: completare blocks
                break;
        }
        concorrenzaFound = concorrenza?.filter((c: ConcorrenzaInterface) => blocks.includes(c.type) && value.includes(c.value) && c.idOperatore !== currentUser.id)[0];
        return concorrenzaFound ? concorrenzaFound.nominativoOperatore : null;
    }
}
