import { Action, State, StateContext } from '@ngxs/store';
import { GetListaMezziSquadre, SetListaMezziSquadre } from '../../actions/sostituzione-partenza/sostituzione-partenza.actions';
import { StartListaComposizioneLoading, StopListaComposizioneLoading } from '../../../../features/home/store/actions/composizione-partenza/composizione-partenza.actions';
import { ListaComposizioneAvanzata } from '../../../../features/home/composizione-partenza/interface/lista-composizione-avanzata-interface';
import { CompPartenzaService } from '../../../../core/service/comp-partenza-service/comp-partenza.service';
import { FiltriComposizione } from '../../../../features/home/composizione-partenza/interface/filtri/filtri-composizione-interface';

export interface SostituzionePartenzaModel {
    listaMezziSquadre: ListaComposizioneAvanzata;
}

export const sostituzionePartenzaDefaults: SostituzionePartenzaModel = {
    listaMezziSquadre: null
};

@State<SostituzionePartenzaModel>({
    name: 'sostituzionePartenza',
    defaults: sostituzionePartenzaDefaults
})
export class SostituzionePartenzaModalState {

    constructor(private compPartenzaService: CompPartenzaService) {
    }

    @Action(GetListaMezziSquadre)
    getListaMezziSquadre({ dispatch }: StateContext<SostituzionePartenzaModel>, action: GetListaMezziSquadre) {
        dispatch(new StartListaComposizioneLoading());
        const filtri = {} as FiltriComposizione;
        filtri.idRichiesta = action.idRichiesta;
        this.compPartenzaService.getListeComposizioneAvanzata(filtri).subscribe((listeCompAvanzata: ListaComposizioneAvanzata) => {
            // const listaBoxPartenza = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
            // if (listeCompAvanzata.composizioneMezzi) {
            //     dispatch(new SetListaMezziComposizione(listeCompAvanzata.composizioneMezzi));
            // }
            // if (listeCompAvanzata.composizioneSquadre) {
            //     dispatch(new SetListaSquadreComposizione(listeCompAvanzata.composizioneSquadre));
            // }
            dispatch(new SetListaMezziSquadre(listeCompAvanzata));
            dispatch(new StopListaComposizioneLoading());
        }, () => {
            dispatch(new StopListaComposizioneLoading());
        });
    }

    @Action(SetListaMezziSquadre)
    setListaMezziSquadre({ patchState }: StateContext<SostituzionePartenzaModel>, action: SetListaMezziSquadre) {
        patchState({
            listaMezziSquadre: action.listaMezziSquadre
        });
    }
}
