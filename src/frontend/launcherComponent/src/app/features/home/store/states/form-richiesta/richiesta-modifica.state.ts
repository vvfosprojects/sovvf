import { Action, Select, Selector, State, StateContext, Store } from '@ngxs/store';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ToggleModifica } from '../../actions/view/view.actions';
import { RichiestaMarker } from '../../../maps/maps-model/richiesta-marker.model';
import { RichiesteMarkersState } from '../maps/richieste-markers.state';
import { ClearRichiestaMarkerModifica, UpdateRichiestaMarker, UpdateRichiestaMarkerModifica } from '../../actions/maps/richieste-markers.actions';
import { GetInitCentroMappa, SetCoordCentroMappa, SetZoomCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { Observable } from 'rxjs';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { makeCopy } from '../../../../../shared/helper/function';
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
    PatchRichiesta
} from '../../actions/form-richiesta/richiesta-modifica.actions';
import { Injectable } from '@angular/core';
import { ViewComponentState } from '../view/view.state';
import { SintesiRichiesteService } from '../../../../../core/service/lista-richieste-service/lista-richieste.service';
import { Tipologia } from '../../../../../shared/model/tipologia.model';
import { TipologieState } from '../../../../../shared/store/states/tipologie/tipologie.state';
import { TriageSummaryState } from '../../../../../shared/store/states/triage-summary/triage-summary.state';
import { Richiedente } from '../../../../../shared/model/richiedente.model';
import { AzioneChiamataEnum } from '../../../../../shared/enum/azione-chiamata.enum';
import { FormRichiestaState } from './form-richiesta.state';

export interface RichiestaModificaStateModel {
    richiestaModifica: SintesiRichiesta;
    richiestaMarker: RichiestaMarker;
    successModifica: boolean;
    modificaIndirizzo: boolean;
}

export const RichiestaModificaStateDefaults: RichiestaModificaStateModel = {
    richiestaModifica: null,
    richiestaMarker: null,
    successModifica: false,
    modificaIndirizzo: false
};

@Injectable()
@State<RichiestaModificaStateModel>({
    name: 'richiestaModifica',
    defaults: RichiestaModificaStateDefaults
})
export class RichiestaModificaState {

    @Select(RichiesteMarkersState.getRichiestaById) richiestaMarker$: Observable<RichiestaMarker>;

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
        if (action.richiesta) {
            this.richiestaMarker$.subscribe(result => {
                if (result) {
                    patchState({
                        richiestaMarker: result
                    });
                }
            });
        }
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
    modificaIndirizzo({ getState, setState, patchState, dispatch }: StateContext<RichiestaModificaStateModel>, action: ModificaIndirizzo): void {
        if (action.nuovoIndirizzo) {
            patchState({
                modificaIndirizzo: true
            });
            const mappaActive = this.store.selectSnapshot(ViewComponentState.mapsIsActive);
            if (mappaActive) {
                const temporaryMarker: RichiestaMarker = makeCopy(getState().richiestaMarker);
                temporaryMarker.localita = action.nuovoIndirizzo;
                dispatch(new UpdateRichiestaMarkerModifica(temporaryMarker));
                dispatch(new SetCoordCentroMappa(action.nuovoIndirizzo.coordinate));
                dispatch(new SetZoomCentroMappa(18));
            }
        }
    }

    @Action(PatchRichiesta)
    patchRichiesta({ getState, dispatch }: StateContext<RichiestaModificaStateModel>, action: PatchRichiesta): void {
        let sintesiRichiesta: SintesiRichiesta;
        if (action.sintesiRichiesta) {
            sintesiRichiesta = action.sintesiRichiesta;
        } else {
            const f = this.store.selectSnapshot(FormRichiestaState.formValue);
            const azioneChiamata = AzioneChiamataEnum.Modifica;
            let tipologia: Tipologia;
            if (f) {
                if (f.codTipologia) {
                    tipologia = this.store.selectSnapshot(TipologieState.tipologie).filter((t: Tipologia) => t.codice === f.codTipologia)[0];
                }
                const triageSummary = this.store.selectSnapshot(TriageSummaryState.summary);
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
                    f.competenze,
                    f.complessita,
                    f.istantePresaInCarico,
                    f.istantePrimaAssegnazione,
                    f.rilevanzaGrave,
                    f.codSchedaContatto ? f.codSchedaContatto : null,
                    f.zoneEmergenza?.length > 1 ? f.zoneEmergenza.split(' ') : null,
                    f.fonogramma,
                    f.partenzeRichiesta,
                    (f.etichette && f.etichette.length) ? f.etichette : null,
                    f.notePubbliche,
                    f.notePrivate,
                    azioneChiamata,
                    f.trnInsChiamata,
                    f.turnoIntervento,
                    f.tipoTerreno,
                    (f.listaEnti?.length) ? f.listaEnti : null,
                    f.listaEntiPresaInCarico,
                    f.obiettivoSensibile,
                    f.rilevanzaStArCu,
                    f.motivazione,
                    f.listaUtentiInLavorazione,
                    f.listaUtentiPresaInCarico,
                    f.codUOCompetenza,
                    f.codSOAllertate,
                    f.sediAllertate,
                    f.codSOCompetente,
                    f.listaEnti,
                    f.urgenza,
                    triageSummary?.length ? triageSummary : null
                );
            }
        }
        this.richiesteService.patchRichiesta(sintesiRichiesta).subscribe(() => {
            dispatch(new SuccessRichiestaModifica());
        }, () => {
            dispatch([
                new ClearIndirizzo(),
                new ClearRichiestaMarkerModifica(),
                new GetInitCentroMappa()
            ]);
        });
    }

    @Action(SuccessRichiestaModifica)
    successModifica({ patchState, dispatch }: StateContext<RichiestaModificaStateModel>): void {
        patchState({
            successModifica: true
        });
        dispatch(new ChiudiRichiestaModifica(true));
    }

    @Action(ChiudiRichiestaModifica)
    chiudiRichiestaModifica({ getState, dispatch }: StateContext<RichiestaModificaStateModel>, action: ChiudiRichiestaModifica): void {
        const state = getState();
        if (state.modificaIndirizzo && !action.mantieniModificaIndirizzo) {
            dispatch(new UpdateRichiestaMarker(state.richiestaMarker));
        }
        dispatch(new ToggleModifica(true));
        dispatch(new ClearRichiestaModifica());
    }

    @Action(ClearRichiestaModifica)
    clearRichiestaModifica({ patchState }: StateContext<RichiestaModificaStateModel>): void {
        patchState(RichiestaModificaStateDefaults);
    }

    @Action(ClearIndirizzo)
    ClearIndirizzo({ dispatch }: StateContext<RichiestaModificaStateModel>): void {
        dispatch(new UpdateFormValue({
            path: 'formRichiesta.richiestaForm',
            value: {
                indirizzo: '',
                latitudine: '',
                longitudine: ''
            }
        }));
    }
}
