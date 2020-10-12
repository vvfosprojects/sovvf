import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
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
import {PaginationComposizionePartenzaState} from '../pagination-composizione-partenza/pagination-composizione-partenza.state';
import {MezziComposizioneState} from '../mezzi-composizione/mezzi-composizione.state';
import {SquadreComposizioneState} from '../squadre-composizione/squadre-composizione.state';
import {FiltriComposizioneState} from '../filtri-composizione/filtri-composizione.state';
import {RicercaComposizioneState} from '../ricerca-composizione/ricerca-composizione.state';
import {BoxPartenzaState} from '../../../../features/home/store/states/composizione-partenza/box-partenza.state';
import {PatchPaginationMezziSquadre} from '../../actions/pagination-composizione-partenza/pagination-composizione-partenza.actions';
import {mezzoComposizioneBusy} from '../../../helper/composizione-functions';
import {RemoveBoxPartenza} from '../../../../features/home/store/actions/composizione-partenza/box-partenza.actions';

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
    name: 'sostituzionePartenza',
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
      /*
        // dispatch(new StartListaComposizioneLoading());
        const obj = {} as FiltriComposizione;
        obj.idRichiesta = action.idRichiesta;
        this.compPartenzaService.getListeComposizioneAvanzata(obj).subscribe((listeCompAvanzata: ListaComposizioneAvanzata) => {
            if (listeCompAvanzata.composizioneMezziDataArray) {
                dispatch(new SetListaMezziComposizione(listeCompAvanzata.composizioneMezziDataArray));
            }
            if (listeCompAvanzata.composizioneSquadreDataArray) {
                dispatch(new SetListaSquadreComposizione(listeCompAvanzata.composizioneSquadreDataArray));
            }
            dispatch(new SetListaMezziSquadre(listeCompAvanzata));
            // dispatch(new StopListaComposizioneLoading());
        }, () => {
            // dispatch(new StopListaComposizioneLoading());
        });
       */

      // dispatch(new StartListaComposizioneLoading());
      // tslint:disable-next-line:no-shadowed-variable
      const state = getState();
      const paginationMezzi = this.store.selectSnapshot(PaginationComposizionePartenzaState.paginationMezzi);
      const paginationSquadre = this.store.selectSnapshot(PaginationComposizionePartenzaState.paginationSquadre);
      const mezzoComp = this.store.selectSnapshot(MezziComposizioneState.mezzoSelezionato);
      const squadreCompArray = this.store.selectSnapshot(SquadreComposizioneState.squadreSelezionate);
      let codDistaccamentoMezziSquadre = null;
      if (mezzoComp) {
        codDistaccamentoMezziSquadre = mezzoComp.mezzo.distaccamento.codice;
      }
      if (squadreCompArray && squadreCompArray.length > 0) {
        codDistaccamentoMezziSquadre = squadreCompArray[0].squadra.distaccamento.codice;
      }
      const obj = {
        idRichiesta: action.options && action.options.idRichiesta ? action.options.idRichiesta : state.idRichiesta,
        mezziPagination: {
          page: action.options && action.options.page && action.options.page.pageMezzi ? action.options.page.pageMezzi : paginationMezzi.page,
          pageSize: paginationMezzi.pageSize
        },
        squadrePagination: {
          page: action.options && action.options.page && action.options.page.pageSquadre ? action.options.page.pageSquadre : paginationSquadre.page,
          pageSize: paginationSquadre.pageSize
        },
        codiceDistaccamentoMezziSquadre: codDistaccamentoMezziSquadre ? codDistaccamentoMezziSquadre : null,
        codiceDistaccamento: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).CodiceDistaccamento : null,
        statoMezzo: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).StatoMezzo.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).StatoMezzo : null,
        tipoMezzo: this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).TipoMezzo.length > 0 ? this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati).TipoMezzo : null,
        ricercaMezzi: this.store.selectSnapshot(RicercaComposizioneState.ricercaMezzi) ? this.store.selectSnapshot(RicercaComposizioneState.ricercaMezzi) : null,
        ricercaSquadre: this.store.selectSnapshot(RicercaComposizioneState.ricercaSquadre) ? this.store.selectSnapshot(RicercaComposizioneState.ricercaSquadre) : null
      } as FiltriComposizione;
      console.log('*******OBJ CHE MANDIAMO SOSTITUZIONE ', obj);
      this.compPartenzaService.getListeComposizioneAvanzata(obj).subscribe((listeCompAvanzata: ListaComposizioneAvanzata) => {
        console.log('*******LISTA MEZZI E SQUADRE ', listeCompAvanzata);
        if (listeCompAvanzata) {
          const listaBoxPartenza = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
          if (listeCompAvanzata.composizioneMezziDataArray) {
            dispatch(new SetListaMezziComposizione(listeCompAvanzata.composizioneMezziDataArray));
          }
          if (listeCompAvanzata.composizioneSquadreDataArray) {
            dispatch(new SetListaSquadreComposizione(listeCompAvanzata.composizioneSquadreDataArray));
          }
          dispatch(new SetListaMezziSquadre(listeCompAvanzata));
          dispatch(new PatchPaginationMezziSquadre('mezzi', listeCompAvanzata.mezziPagination));
          dispatch(new PatchPaginationMezziSquadre('squadre', listeCompAvanzata.squadrePagination));

          if (listaBoxPartenza.length > 0) {
            const listaBoxMezzi = listaBoxPartenza.filter(box => box.mezzoComposizione !== null);
            if (listaBoxMezzi.length > 0) {
              const mezziOccupati = [];
              listeCompAvanzata.composizioneMezziDataArray.forEach(mezzo => {
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
