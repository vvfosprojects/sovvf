import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import {
    ClearComposizioneAvanzata,
    GetListeComposizioneAvanzata,
    UnselectMezziAndSquadreComposizioneAvanzata
} from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { MezziComposizioneState } from '../../../../../shared/store/states/mezzi-composizione/mezzi-composizione.state';
import { ComposizionePartenzaState } from './composizione-partenza.state';
import { ClearSelectedMezziComposizione, SetListaMezziComposizione } from '../../../../../shared/store/actions/mezzi-composizione/mezzi-composizione.actions';
import { ClearSelectedSquadreComposizione, SetListaSquadreComposizione } from '../../../../../shared/store/actions/squadre-composizione/squadre-composizione.actions';
import {
    ListaComposizioneAvanzata, MezziComposizioneAvanzata,
    SquadreComposizioneAvanzata,
} from '../../../../../shared/interface/lista-composizione-avanzata-interface';
import { BoxPartenzaState } from './box-partenza.state';
import { mezzoComposizioneBusy } from '../../../../../shared/helper/function-composizione';
import { RemoveBoxPartenza } from '../../actions/composizione-partenza/box-partenza.actions';
import {
    StartListaMezziComposizioneLoading,
    StartListaSquadreComposizioneLoading,
    StopListaMezziComposizioneLoading,
    StopListaSquadreComposizioneLoading
} from '../../actions/composizione-partenza/composizione-partenza.actions';
import { FiltriComposizioneState } from '../../../../../shared/store/states/filtri-composizione/filtri-composizione.state';
import { PaginationComposizionePartenzaState } from 'src/app/shared/store/states/pagination-composizione-partenza/pagination-composizione-partenza.state';
import { FiltriComposizione } from '../../../composizione-partenza/interface/filtri/filtri-composizione-interface';
import { Injectable } from '@angular/core';
import { PatchPaginationComposizionePartenza } from '../../../../../shared/store/actions/pagination-composizione-partenza/pagination-composizione-partenza.actions';
import { RicercaComposizioneState } from 'src/app/shared/store/states/ricerca-composizione/ricerca-composizione.state';
import { SquadreComposizioneState } from '../../../../../shared/store/states/squadre-composizione/squadre-composizione.state';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';
import { SquadraComposizione } from '../../../../../shared/interface/squadra-composizione-interface';

export interface ComposizioneAvanzataStateModel {
    listaMezziSquadre: ListaComposizioneAvanzata;
}

export const ComposizioneAvanzataStateDefaults: ComposizioneAvanzataStateModel = {
    listaMezziSquadre: null
};

@Injectable()
@State<ComposizioneAvanzataStateModel>({
    name: 'composizioneAvanzata',
    defaults: ComposizioneAvanzataStateDefaults
})
export class ComposizioneAvanzataState {

    @Selector()
    static listaMezziSquadre(state: ComposizioneAvanzataStateModel): ListaComposizioneAvanzata {
        return state.listaMezziSquadre;
    }

    constructor(private compPartenzaService: CompPartenzaService,
                private store: Store) {
    }

    @Action(GetListeComposizioneAvanzata)
    getListeComposizioneAvanzata({ dispatch }: StateContext<ComposizioneAvanzataStateModel>, action: GetListeComposizioneAvanzata): void {
        const triggerPageSquadre = !!(action && action.options && action.options.page && action.options.page.pageMezzi);
        const triggerPageMezzi = !!(action && action.options && action.options.page && action.options.page.pageSquadre);
        const skipGetMezzi = triggerPageMezzi || action.filtroSquadre;
        const skipGetSquadre = triggerPageSquadre || action.filtroMezzi;
        const paginationMezzi = this.store.selectSnapshot(PaginationComposizionePartenzaState.paginationMezzi);
        const paginationSquadre = this.store.selectSnapshot(PaginationComposizionePartenzaState.paginationSquadre);
        const mezzoSelezionato = this.store.selectSnapshot(MezziComposizioneState.mezzoSelezionato)?.mezzo;
        const squadreSelezionate = this.store.selectSnapshot(SquadreComposizioneState.squadreSelezionate)?.map((s: SquadraComposizione) => s);
        const codiceChiamata = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione)?.codice;
        const objGetMezzi = {
            codiceChiamata: codiceChiamata ? codiceChiamata : null,
            pagination: {
                page: action && action.options && action.options.page && action.options.page.pageMezzi ? action.options.page.pageMezzi : paginationMezzi.page,
                pageSize: paginationMezzi.pageSize
            },
            codDistaccamentoSelezionato: mezzoSelezionato ? mezzoSelezionato.distaccamento.codice : null,
            codiciDistaccamenti: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento : null,
            stato: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).StatoMezzo.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).StatoMezzo : null,
            // tslint:disable-next-line:max-line-length
            tipo: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).TipoMezzo && this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).TipoMezzo.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).TipoMezzo : null,
            ricerca: this.store.selectSnapshot(RicercaComposizioneState.ricercaMezzi) ? this.store.selectSnapshot(RicercaComposizioneState.ricercaMezzi) : null,
        } as FiltriComposizione;
        let statoSquadra;
        switch (this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).StatoMezzo[0]) {
            case 'In Sede':
                statoSquadra = 0;
                break;
            case 'In Rientro':
                statoSquadra = 1;
                break;
            case 'In Viaggio':
                statoSquadra = 2;
                break;
            case 'Sul Posto':
                statoSquadra = 3;
                break;
            default:
                statoSquadra = null;
        }
        const objGetSquadre = {
            codiceChiamata: codiceChiamata ? codiceChiamata : null,
            diEmergenza: false,
            pagination: {
                page: action.options && action.options.page && action.options.page.pageSquadre ? action.options.page.pageSquadre : paginationSquadre.page,
                pageSize: paginationSquadre.pageSize
            },
            turno: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).Turno,
            codDistaccamentoSelezionato: squadreSelezionate && squadreSelezionate[0] ? squadreSelezionate[0].distaccamento.codice : null,
            stato: statoSquadra,
            codiciDistaccamenti: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento : null,
            ricerca: this.store.selectSnapshot(RicercaComposizioneState.ricercaSquadre) ? this.store.selectSnapshot(RicercaComposizioneState.ricercaSquadre) : null
        } as FiltriComposizione;
        if (!skipGetMezzi) {
            console.log('***Obj getMezzi: ', objGetMezzi);
            dispatch(new StartListaMezziComposizioneLoading());
            this.compPartenzaService.getMezziComposizioneAvanzata(objGetMezzi).subscribe((listaMezziComposizioneAvanzata: MezziComposizioneAvanzata) => {
                if (listaMezziComposizioneAvanzata) {
                    const listaBoxPartenza = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
                    if (listaMezziComposizioneAvanzata.dataArray) {
                        dispatch(new SetListaMezziComposizione(listaMezziComposizioneAvanzata.dataArray));
                    }
                    dispatch(new PatchPaginationComposizionePartenza('mezzi', listaMezziComposizioneAvanzata.pagination));

                    if (listaBoxPartenza?.length) {
                        const listaBoxMezzi = listaBoxPartenza.filter(box => box.mezzoComposizione !== null);
                        if (listaBoxMezzi?.length) {
                            const mezziOccupati = [];
                            listaMezziComposizioneAvanzata.dataArray.forEach(mezzo => {
                                if (mezzoComposizioneBusy(mezzo.mezzo.stato)) {
                                    mezziOccupati.push(mezzo.id);
                                }
                            });
                            if (mezziOccupati?.length) {
                                listaBoxPartenza.forEach(box => {
                                    if (box.mezzoComposizione && box.mezzoComposizione.mezzo.stato !== StatoMezzo.InRientro && mezziOccupati.includes(box.mezzoComposizione.id)) {
                                        dispatch(new RemoveBoxPartenza(box));
                                    }
                                });
                            }
                        }
                    }
                }
                dispatch(new StopListaMezziComposizioneLoading());
            }, () => {
                dispatch(new StopListaMezziComposizioneLoading());
                console.log('Get Mezzi Composizione Avanzata failed');
            });
        }

        if (!skipGetSquadre) {
            console.log('***Obj getSquadre: ', objGetSquadre);
            dispatch(new StartListaSquadreComposizioneLoading());
            this.compPartenzaService.getSquadreComposizioneAvanzata(objGetSquadre).subscribe((listaSquadreComposizioneAvanzata: SquadreComposizioneAvanzata) => {
                if (listaSquadreComposizioneAvanzata) {
                    if (listaSquadreComposizioneAvanzata.dataArray) {
                        dispatch(new SetListaSquadreComposizione(listaSquadreComposizioneAvanzata.dataArray));
                    }
                    dispatch(new PatchPaginationComposizionePartenza('squadre', listaSquadreComposizioneAvanzata.pagination));
                }
                dispatch(new StopListaSquadreComposizioneLoading());
            }, () => {
                dispatch(new StopListaSquadreComposizioneLoading());
                console.log('Get Squadre Composizione Avanzata failed');
            });
        }
    }

    @Action(UnselectMezziAndSquadreComposizioneAvanzata)
    unselectMezziAndSquadreComposizioneAvanzata({ dispatch }: StateContext<ComposizioneAvanzataStateModel>): void {
        dispatch(new ClearSelectedMezziComposizione());
        dispatch(new ClearSelectedSquadreComposizione());
    }

    @Action(ClearComposizioneAvanzata)
    clearComposizioneAvanzata({ patchState }: StateContext<ComposizioneAvanzataStateModel>): void {
        patchState(ComposizioneAvanzataStateDefaults);
    }
}
