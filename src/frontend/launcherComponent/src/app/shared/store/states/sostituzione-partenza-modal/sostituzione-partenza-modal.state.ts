import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    GetListaMezziSquadre,
    IdRichiestaSostituzione,
    SetListaMezziSquadre,
    StartListaComposizioneLoading,
    StopListaComposizioneLoading
} from '../../actions/sostituzione-partenza/sostituzione-partenza.actions';
import { ListaComposizioneAvanzata } from '../../../interface/lista-composizione-avanzata-interface';
import { CompPartenzaService } from '../../../../core/service/comp-partenza-service/comp-partenza.service';
import { FilterListaMezziComposizione, SetListaMezziComposizione } from '../../actions/mezzi-composizione/mezzi-composizione.actions';
import { SetListaSquadreComposizione } from '../../actions/squadre-composizione/squadre-composizione.actions';
import { FiltriComposizione } from 'src/app/features/home/composizione-partenza/interface/filtri/filtri-composizione-interface';
import { Injectable } from '@angular/core';
import { PaginationComposizionePartenzaState } from '../pagination-composizione-partenza/pagination-composizione-partenza.state';
import { MezziComposizioneState } from '../mezzi-composizione/mezzi-composizione.state';
import { SquadreComposizioneState } from '../squadre-composizione/squadre-composizione.state';
import { FiltriComposizioneState } from '../filtri-composizione/filtri-composizione.state';
import { RicercaComposizioneState } from '../ricerca-composizione/ricerca-composizione.state';
import { BoxPartenzaState } from '../../../../features/home/store/states/composizione-partenza/box-partenza.state';
import { PatchPaginationComposizionePartenza } from '../../actions/pagination-composizione-partenza/pagination-composizione-partenza.actions';
import { mezzoComposizioneBusy } from '../../../helper/composizione-functions';
import { RemoveBoxPartenza } from '../../../../features/home/store/actions/composizione-partenza/box-partenza.actions';
import { SquadraComposizione } from '../../../interface/squadra-composizione-interface';
import { SetListeComposizioneAvanzata } from '../../../../features/home/store/actions/composizione-partenza/composizione-avanzata.actions';

export interface SostituzionePartenzaModel {
    idRichiesta: string;
    listaMezziSquadre: ListaComposizioneAvanzata;
    sostituzionePartenzaForm: {
        model?: {
            motivazioneAnnullamento: string
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
    loadingListe: boolean;
}

export const sostituzionePartenzaDefaults: SostituzionePartenzaModel = {
    idRichiesta: null,
    listaMezziSquadre: null,
    sostituzionePartenzaForm: {
        model: {
            motivazioneAnnullamento: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    },
    loadingListe: false
};

@Injectable()
@State<SostituzionePartenzaModel>({
    name: 'sostituzionePartenzaModal',
    defaults: sostituzionePartenzaDefaults
})
export class SostituzionePartenzaModalState {

    @Selector()
    static formValid(state: SostituzionePartenzaModel): boolean {
        return state.sostituzionePartenzaForm.status !== 'INVALID';
    }

    @Selector()
    static loadingListe(state: SostituzionePartenzaModel): boolean {
        return state.loadingListe;
    }

    @Selector()
    static idRichiestaSostituzione(state: SostituzionePartenzaModel): string {
        return state.idRichiesta;
    }

    @Action(IdRichiestaSostituzione)
    setIdRichiestaSostituzione({ patchState, dispatch }: StateContext<SostituzionePartenzaModel>, action: any): void {
        patchState({
            idRichiesta: action.idRichiesta,
        });
    }

    constructor(private compPartenzaService: CompPartenzaService, private store: Store) {
    }

    @Action(GetListaMezziSquadre)
    getListaMezziSquadre({ dispatch, getState }: StateContext<SostituzionePartenzaModel>, action: GetListaMezziSquadre): void {
        dispatch(new StartListaComposizioneLoading());
        const state = getState();
        const paginationMezzi = this.store.selectSnapshot(PaginationComposizionePartenzaState.paginationMezzi);
        const paginationSquadre = this.store.selectSnapshot(PaginationComposizionePartenzaState.paginationSquadre);
        const mezzoSelezionato = this.store.selectSnapshot(MezziComposizioneState.mezzoSelezionato)?.mezzo;
        const squadreSelezionate = this.store.selectSnapshot(SquadreComposizioneState.squadreSelezionate)?.map((s: SquadraComposizione) => s.squadra);
        const idRichiesta = state?.idRichiesta;
        const obj = {
            idRichiesta: idRichiesta ? idRichiesta : null,
            mezziPagination: {
                page: action.options && action.options.page && action.options.page.pageMezzi ? action.options.page.pageMezzi : paginationMezzi.page,
                pageSize: paginationMezzi.pageSize
            },
            squadrePagination: {
                page: action.options && action.options.page && action.options.page.pageSquadre ? action.options.page.pageSquadre : paginationSquadre.page,
                pageSize: paginationSquadre.pageSize
            },
            mezzo: mezzoSelezionato ? mezzoSelezionato : null,
            squadre: squadreSelezionate && squadreSelezionate.length > 0 ? squadreSelezionate : null,
            turno: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).Turno,
            codiceDistaccamento: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento : null,
            statoMezzo: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).StatoMezzo.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).StatoMezzo : null,
            tipoMezzo: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).TipoMezzo.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).TipoMezzo : null,
            ricercaMezzi: this.store.selectSnapshot(RicercaComposizioneState.ricercaMezzi) ? this.store.selectSnapshot(RicercaComposizioneState.ricercaMezzi) : null,
            ricercaSquadre: this.store.selectSnapshot(RicercaComposizioneState.ricercaSquadre) ? this.store.selectSnapshot(RicercaComposizioneState.ricercaSquadre) : null
        } as FiltriComposizione;
        this.compPartenzaService.getListeComposizioneAvanzata(obj).subscribe((listaMezziSquadre: ListaComposizioneAvanzata) => {
            if (listaMezziSquadre) {
                const listaBoxPartenza = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
                if (listaMezziSquadre.composizioneMezziDataArray) {
                    dispatch(new SetListaMezziComposizione(listaMezziSquadre.composizioneMezziDataArray));
                }
                if (listaMezziSquadre.composizioneSquadreDataArray) {
                    dispatch(new SetListaSquadreComposizione(listaMezziSquadre.composizioneSquadreDataArray));
                }
                dispatch(new SetListeComposizioneAvanzata(listaMezziSquadre));
                dispatch(new PatchPaginationComposizionePartenza('mezzi', listaMezziSquadre.mezziPagination));
                dispatch(new PatchPaginationComposizionePartenza('squadre', listaMezziSquadre.squadrePagination));

                if (listaBoxPartenza.length > 0) {
                    const listaBoxMezzi = listaBoxPartenza.filter(box => box.mezzoComposizione !== null);
                    if (listaBoxMezzi.length > 0) {
                        const mezziOccupati = [];
                        listaMezziSquadre.composizioneMezziDataArray.forEach(mezzo => {
                            if (mezzoComposizioneBusy(mezzo.mezzo.stato)) {
                                mezziOccupati.push(mezzo.id);
                            }
                        });
                        if (mezziOccupati.length > 0) {
                            listaBoxPartenza.forEach(box => {
                                if (box.mezzoComposizione && mezziOccupati.includes(box.mezzoComposizione.id)) {
                                    dispatch(new RemoveBoxPartenza(box));
                                }
                            });
                        }
                    }
                }
                dispatch(new StopListaComposizioneLoading());
            }
        }, () => {
            dispatch(new StopListaComposizioneLoading());
        });
    }

    @Action(SetListaMezziSquadre)
    setListaMezziSquadre({ patchState, dispatch }: StateContext<SostituzionePartenzaModel>, action: SetListaMezziSquadre): void {
        patchState({
            listaMezziSquadre: action.listaMezziSquadre
        });
        dispatch(new FilterListaMezziComposizione());
    }


    @Action(StartListaComposizioneLoading)
    startListaComposizioneLoading({ patchState }: StateContext<SostituzionePartenzaModel>): void {
        patchState({
            loadingListe: true
        });
    }

    @Action(StopListaComposizioneLoading)
    stopListaComposizioneLoading({ patchState }: StateContext<SostituzionePartenzaModel>): void {
        patchState({
            loadingListe: false
        });
    }
}
