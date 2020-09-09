import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetListaMezziSquadre, SetListaMezziSquadre } from '../../actions/sostituzione-partenza/sostituzione-partenza.actions';
import { StartListaComposizioneLoading, StopListaComposizioneLoading } from '../../../../features/home/store/actions/composizione-partenza/composizione-partenza.actions';
import { ListaComposizioneAvanzata } from '../../../interface/lista-composizione-avanzata-interface';
import { CompPartenzaService } from '../../../../core/service/comp-partenza-service/comp-partenza.service';
import { FiltriComposizione } from '../../../../features/home/composizione-partenza/interface/filtri/filtri-composizione-interface';
import { FilterListaMezziComposizione, SetListaMezziComposizione } from '../../actions/mezzi-composizione/mezzi-composizione.actions';
import { SetListaSquadreComposizione } from '../../actions/squadre-composizione/squadre-composizione.actions';
import { GetFiltriComposizione } from '../../actions/filtri-composizione/filtri-composizione.actions';

export interface SostituzionePartenzaModel {
    listaMezziSquadre: ListaComposizioneAvanzata;
    sostituzionePartenzaForm: {
        model?: {
            codMezzo: string;
            codSquadre: string[];
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const sostituzionePartenzaDefaults: SostituzionePartenzaModel = {
    listaMezziSquadre: null,
    sostituzionePartenzaForm: {
        model: {
            codMezzo: undefined,
            codSquadre: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    }
};

@State<SostituzionePartenzaModel>({
    name: 'sostituzionePartenza',
    defaults: sostituzionePartenzaDefaults
})
export class SostituzionePartenzaModalState {

    @Selector()
    static formValid(state: SostituzionePartenzaModel) {
        return state.sostituzionePartenzaForm.status !== 'INVALID';
    }

    constructor(private compPartenzaService: CompPartenzaService) {
    }

    @Action(GetListaMezziSquadre)
    getListaMezziSquadre({ dispatch }: StateContext<SostituzionePartenzaModel>, action: GetListaMezziSquadre) {
        // dispatch(new StartListaComposizioneLoading());
        const filtri = {} as FiltriComposizione;
        filtri.idRichiesta = action.idRichiesta;
        this.compPartenzaService.getListeComposizioneAvanzata(filtri).subscribe((listeCompAvanzata: ListaComposizioneAvanzata) => {
            if (listeCompAvanzata.composizioneMezzi) {
                dispatch(new SetListaMezziComposizione(listeCompAvanzata.composizioneMezzi));
            }
            if (listeCompAvanzata.composizioneSquadre) {
                dispatch(new SetListaSquadreComposizione(listeCompAvanzata.composizioneSquadre));
            }
            dispatch(new SetListaMezziSquadre(listeCompAvanzata));
            // dispatch(new StopListaComposizioneLoading());
        }, () => {
            // dispatch(new StopListaComposizioneLoading());
        });
    }

    @Action(SetListaMezziSquadre)
    setListaMezziSquadre({ patchState, dispatch }: StateContext<SostituzionePartenzaModel>, action: SetListaMezziSquadre) {
        patchState({
            listaMezziSquadre: action.listaMezziSquadre
        });
        dispatch(new FilterListaMezziComposizione());
    }
}
