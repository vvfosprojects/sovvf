import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    GetListaMezziSquadre,
    IdRichiestaSostituzione,
    SetListaMezziSquadre,
    StartListaComposizioneLoading,
    StopListaComposizioneLoading
} from '../../actions/sostituzione-partenza/sostituzione-partenza.actions';
import { ListaComposizioneAvanzata, MezziComposizioneAvanzata, SquadreComposizioneAvanzata } from '../../../interface/lista-composizione-avanzata-interface';
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
import { mezzoComposizioneBusy } from '../../../helper/function-composizione';
import { RemoveBoxPartenza } from '../../../../features/home/store/actions/composizione-partenza/box-partenza.actions';
import { SquadraComposizione } from '../../../interface/squadra-composizione-interface';
import { ComposizionePartenzaState } from '../../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { StatoMezzo } from '../../../enum/stato-mezzo.enum';

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
        const paginationMezzi = this.store.selectSnapshot(PaginationComposizionePartenzaState.paginationMezzi);
        const paginationSquadre = this.store.selectSnapshot(PaginationComposizionePartenzaState.paginationSquadre);
        const mezzoSelezionato = this.store.selectSnapshot(MezziComposizioneState.mezzoSelezionato)?.mezzo;
        const squadreSelezionate = this.store.selectSnapshot(SquadreComposizioneState.squadreSelezionate)?.map((s: SquadraComposizione) => s);
        const codiceChiamata = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione)?.codice;
        const objMezzi = {
            codiceChiamata: codiceChiamata ? codiceChiamata : null,
            pagination: {
                page: action.options && action.options.page && action.options.page.pageMezzi ? action.options.page.pageMezzi : paginationMezzi.page,
                pageSize: paginationMezzi.pageSize
            },
            codDistaccamentoSelezionato: mezzoSelezionato ? mezzoSelezionato.distaccamento.codice : null,
            codiciDistaccamenti: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento : null,
            stato: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).StatoMezzo.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).StatoMezzo : null,
            // tslint:disable-next-line:max-line-length
            tipo: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).TipoMezzo && this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).TipoMezzo.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).TipoMezzo : null,
            ricerca: this.store.selectSnapshot(RicercaComposizioneState.ricercaMezzi) ? this.store.selectSnapshot(RicercaComposizioneState.ricercaMezzi) : null,
        } as FiltriComposizione;
        const objSquadre = {
            codiceChiamata: codiceChiamata ? codiceChiamata : null,
            diEmergenza: false,
            pagination: {
                page: action.options && action.options.page && action.options.page.pageSquadre ? action.options.page.pageSquadre : paginationSquadre.page,
                pageSize: paginationSquadre.pageSize
            },
            turno: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).Turno,
            codDistaccamentoSelezionato: squadreSelezionate && squadreSelezionate[0] ? squadreSelezionate[0].distaccamento.codice : null,
            codiciDistaccamenti: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento : null,
            ricerca: this.store.selectSnapshot(RicercaComposizioneState.ricercaSquadre) ? this.store.selectSnapshot(RicercaComposizioneState.ricercaSquadre) : null
        } as FiltriComposizione;
        console.log('***PAYLOAD MEZZI ', objMezzi);
        console.log('***PAYLOAD SQUADRE ', objSquadre);

        this.compPartenzaService.getMezziComposizioneAvanzata(objMezzi).subscribe((listaMezziComposizioneAvanzata: MezziComposizioneAvanzata) => {
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
                dispatch(new StopListaComposizioneLoading());
            }
        }, () => {
            dispatch(new StopListaComposizioneLoading());
            console.log('***getMezziComposizioneAvanzata failed');
        });

        this.compPartenzaService.getSquadreComposizioneAvanzata(objSquadre).subscribe((listaSquadreComposizioneAvanzata: SquadreComposizioneAvanzata) => {
            if (listaSquadreComposizioneAvanzata) {
                if (listaSquadreComposizioneAvanzata.dataArray) {
                    dispatch(new SetListaSquadreComposizione(listaSquadreComposizioneAvanzata.dataArray));
                }
                dispatch(new PatchPaginationComposizionePartenza('squadre', listaSquadreComposizioneAvanzata.pagination));
            }
            dispatch(new StopListaComposizioneLoading());
        }, () => {
            dispatch(new StopListaComposizioneLoading());
            console.log('***getSquadreComposizioneAvanzata failed');
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
