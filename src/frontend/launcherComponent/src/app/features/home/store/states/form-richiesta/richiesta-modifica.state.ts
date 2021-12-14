import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ToggleComposizione, ToggleModifica } from '../../actions/view/view.actions';
import { GetInitCentroMappa } from '../../../../maps/store/actions/centro-mappa.actions';
import produce from 'immer';
import {
    ChiudiRichiestaModifica,
    ClearRichiestaModifica,
    ModificaIndirizzo,
    ModificaRilevanza,
    ModificaRilevanzaStArCu,
    SetRichiestaModifica,
    SuccessRichiestaModifica,
    ClearIndirizzo,
    PatchRichiesta,
    PatchEntiIntervenutiRichiesta
} from '../../actions/form-richiesta/richiesta-modifica.actions';
import { Injectable } from '@angular/core';
import { SintesiRichiesteService } from '../../../../../core/service/lista-richieste-service/lista-richieste.service';
import { Tipologia } from '../../../../../shared/model/tipologia.model';
import { TipologieState } from '../../../../../shared/store/states/tipologie/tipologie.state';
import { TriageSummaryState } from '../../../../../shared/store/states/triage-summary/triage-summary.state';
import { Richiedente } from '../../../../../shared/model/richiedente.model';
import { AzioneChiamataEnum } from '../../../../../shared/enum/azione-chiamata.enum';
import { makeCopy } from '../../../../../shared/helper/function-generiche';
import { SchedaTelefonataState } from './scheda-telefonata.state';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { TipoTerrenoEnum } from 'src/app/shared/enum/tipo-terreno.enum';
import { TipoTerreno } from 'src/app/shared/model/tipo-terreno';
import { SetRedirectComposizionePartenza, StartLoadingSchedaRichiesta, StopLoadingSchedaRichiesta } from '../../actions/form-richiesta/scheda-telefonata.actions';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { SetRichiestaComposizione } from '../../actions/composizione-partenza/composizione-partenza.actions';

export interface RichiestaModificaStateModel {
    richiestaModifica: SintesiRichiesta;
    successModifica: boolean;
    modificaIndirizzo: boolean;
}

export const RichiestaModificaStateDefaults: RichiestaModificaStateModel = {
    richiestaModifica: null,
    successModifica: false,
    modificaIndirizzo: false
};

@Injectable()
@State<RichiestaModificaStateModel>({
    name: 'richiestaModifica',
    defaults: RichiestaModificaStateDefaults
})
export class RichiestaModificaState {

    constructor(private store: Store,
                private richiesteService: SintesiRichiesteService) {
    }

    @Selector()
    static richiestaModifica(state: RichiestaModificaStateModel): SintesiRichiesta {
        return state.richiestaModifica;
    }

    @Selector()
    static successModifica(state: RichiestaModificaStateModel): boolean {
        return state.successModifica;
    }

    @Action(SetRichiestaModifica)
    setRichiestaModifica({ patchState }: StateContext<RichiestaModificaStateModel>, action: SetRichiestaModifica): void {
        patchState({
            richiestaModifica: action.richiesta
        });
    }

    @Action(ModificaRilevanza)
    modificaRilevanza({ getState, setState }: StateContext<RichiestaModificaStateModel>): void {
        setState(
            produce(getState(), draft => {
                const richiesta = makeCopy(draft.richiestaModifica);
                if (draft.richiestaModifica.rilevanteGrave === true) {
                    richiesta.rilevanteGrave = false;
                    draft.richiestaModifica = richiesta;
                } else {
                    richiesta.rilevanteGrave = true;
                    draft.richiestaModifica = richiesta;
                }
            })
        );
    }

    @Action(ModificaRilevanzaStArCu)
    modificaRilevanzaStArCu({ getState, setState }: StateContext<RichiestaModificaStateModel>): void {
        setState(
            produce(getState(), draft => {
                const richiesta = draft.richiestaModifica;
                if (draft.richiestaModifica.rilevanteStArCu === true) {
                    richiesta.rilevanteStArCu = false;
                    draft.richiestaModifica = richiesta;
                } else {
                    richiesta.rilevanteStArCu = true;
                    draft.richiestaModifica = richiesta;
                }
            })
        );
    }

    @Action(ModificaIndirizzo)
    modificaIndirizzo({ getState, patchState, dispatch }: StateContext<RichiestaModificaStateModel>, action: ModificaIndirizzo): void {
        if (action.nuovoIndirizzo) {
            patchState({
                modificaIndirizzo: true
            });
        }
    }

    @Action(PatchRichiesta)
    patchRichiesta({ getState, dispatch }: StateContext<RichiestaModificaStateModel>, action: PatchRichiesta): void {
        let sintesiRichiesta: SintesiRichiesta;
        if (action.sintesiRichiesta) {
            sintesiRichiesta = action.sintesiRichiesta;
        } else {
            const f = this.store.selectSnapshot(SchedaTelefonataState.formValue);
            const azioneChiamata = AzioneChiamataEnum.Modifica;
            let tipologia: Tipologia;

            if (f) {

                if (f.codTipologia) {
                    tipologia = this.store.selectSnapshot(TipologieState.tipologie).filter((t: Tipologia) => t.codice === f.codTipologia)[0];
                }

                const competenze = this.store.selectSnapshot(SchedaTelefonataState.competenze);
                const triageSummary = this.store.selectSnapshot(TriageSummaryState.summary);
                const tipiTerreno = [] as TipoTerreno[];

                if (f.boschi) {
                    tipiTerreno.push({
                        descrizione: TipoTerrenoEnum.Boschi,
                        ha: f.boschi
                    });
                }
                if (f.campi) {
                    tipiTerreno.push({
                        descrizione: TipoTerrenoEnum.Campi,
                        ha: f.campi
                    });
                }
                if (f.sterpaglie) {
                    tipiTerreno.push({
                        descrizione: TipoTerrenoEnum.Sterpaglie,
                        ha: f.sterpaglie
                    });
                }

                sintesiRichiesta = new SintesiRichiesta(
                    f.id,
                    f.codice,
                    f.codiceRichiesta,
                    f.operatore,
                    f.istanteRicezioneRichiesta,
                    f.stato,
                    f.prioritaRichiesta,
                    [tipologia],
                    f.dettaglioTipologia ? f.dettaglioTipologia : null,
                    f.dettaglioTipologia ? f.dettaglioTipologia.descrizione : (f.codTipologia ? tipologia.descrizione : null),
                    new Richiedente(f.telefono, f.nominativo),
                    {
                        indirizzo: f.indirizzo,
                        piano: f.piano,
                        palazzo: f.palazzo,
                        scala: f.scala,
                        interno: f.interno,
                        contatto: f.codSchedaContatto,
                        note: f.noteIndirizzo,
                        coordinate: {
                            longitudine: f.longitudine,
                            latitudine: f.latitudine
                        },
                    },
                    competenze ? competenze : f.competenze,
                    f.complessita,
                    f.istantePresaInCarico,
                    f.istantePrimaAssegnazione,
                    f.rilevanzaGrave,
                    f.codSchedaContatto ? f.codSchedaContatto : null,
                    null,
                    f.fonogramma,
                    f.partenze,
                    (f.etichette && f.etichette.length) ? f.etichette : null,
                    f.notePubbliche,
                    f.notePrivate,
                    azioneChiamata,
                    f.trnInsChiamata,
                    f.turnoIntervento,
                    tipiTerreno.length ? tipiTerreno : null,
                    f.codEntiIntervenuti?.length ? f.codEntiIntervenuti : null,
                    f.listaEntiPresaInCarico,
                    f.obiettivoSensibile,
                    f.rilevanzaStArCu,
                    f.motivazione,
                    f.listaUtentiPresaInCarico,
                    f.codUOCompetenza,
                    f.codSOAllertate,
                    f.sediAllertate,
                    f.codSOCompetente,
                    f.urgenza,
                    f.esercitazione,
                    triageSummary?.length ? triageSummary : null,
                    f.noteNue
                );
            }
        }
        dispatch(new StartLoadingSchedaRichiesta());
        this.richiesteService.patchRichiesta(sintesiRichiesta).subscribe(() => {
            const redirectComposizionePartenza = this.store.selectSnapshot(SchedaTelefonataState.redirectComposizionePartenza);
            if (redirectComposizionePartenza) {
                dispatch([
                    new SuccessRichiestaModifica(),
                    new StopLoadingSchedaRichiesta(),
                    new SetRichiestaComposizione(sintesiRichiesta),
                    new ToggleComposizione(Composizione.Avanzata),
                    new SetRedirectComposizionePartenza(false),
                ]);
            } else {
                dispatch([
                    new SuccessRichiestaModifica(true),
                    new StopLoadingSchedaRichiesta()
                ]);
            }

        }, () => {
            dispatch([
                new ClearIndirizzo(),
                new GetInitCentroMappa(),
                new StopLoadingSchedaRichiesta()
            ]);
        });
    }

    @Action(PatchEntiIntervenutiRichiesta)
    patchEntiIntervenutiRichiesta({ dispatch }: StateContext<RichiestaModificaStateModel>, action: PatchEntiIntervenutiRichiesta): void {

        const obj = {
            idEnteIntervenuto: action.codEntiIntervenuti?.length ? action.codEntiIntervenuti : [],
            codRichiesta: action.idRichiesta
        };

        this.richiesteService.modificaEntiIntervenutiRichiesta(obj).subscribe(() => {
            // dispatch(new SuccessRichiestaModifica());
        }, () => {
            // dispatch([
            //     new ClearIndirizzo(),
            //     new ClearRichiestaMarkerModifica(),
            //     new GetInitCentroMappa()
            // ]);
        });
    }

    @Action(SuccessRichiestaModifica)
    successModifica({ patchState, dispatch }: StateContext<RichiestaModificaStateModel>, action: SuccessRichiestaModifica): void {
        patchState({
            successModifica: true
        });
        dispatch(new ChiudiRichiestaModifica(action.homeViewRequest));
    }

    @Action(ChiudiRichiestaModifica)
    chiudiRichiestaModifica({ dispatch }: StateContext<RichiestaModificaStateModel>, action: ChiudiRichiestaModifica): void {
        if (!action.homeViewRequest) {
            dispatch([
                new ToggleModifica(true),
                new ClearRichiestaModifica()
            ]);
        } else {
            dispatch([
                new ToggleModifica(true, true),
                new ClearRichiestaModifica()
            ]);
        }
    }

    @Action(ClearRichiestaModifica)
    clearRichiestaModifica({ patchState }: StateContext<RichiestaModificaStateModel>): void {
        patchState(RichiestaModificaStateDefaults);
    }

    @Action(ClearIndirizzo)
    clearIndirizzo({ dispatch }: StateContext<RichiestaModificaStateModel>): void {
        dispatch(new UpdateFormValue({
            path: 'schedaTelefonata.richiestaForm',
            value: {
                indirizzo: '',
                latitudine: '',
                longitudine: ''
            }
        }));
    }
}
