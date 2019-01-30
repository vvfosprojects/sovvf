import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BoxRichiesteService } from '../../../../../core/service/boxes-service/box-richieste.service';
import { BoxMezziService } from '../../../../../core/service/boxes-service/box-mezzi.service';
import { BoxPersonaleService } from '../../../../../core/service/boxes-service/box-personale.service';

// Model
import { BoxPersonale } from '../../boxes-model/box-personale.model';
import { BoxMezzi } from '../../boxes-model/box-mezzi.model';
import { BoxInterventi } from '../../boxes-model/box-interventi.model';

// Action
import { FetchBoxPersonale, SetBoxPersonale, FetchBoxMezzi, SetBoxMezzi, FetchBoxInterventi, SetBoxInterventi } from '../actions/boxes.actions';

export interface BoxesStateModel {
    interventi: BoxInterventi;
    mezzi: BoxMezzi;
    personale: BoxPersonale;
}

export const boxesStateDefaults: BoxesStateModel = {
    interventi: null,
    mezzi: null,
    personale: null
};

@State<BoxesStateModel>({
    name: 'boxes',
    defaults: boxesStateDefaults
})
export class BoxesState {

    constructor(private _richieste: BoxRichiesteService,
                private _mezzi: BoxMezziService,
                private _personale: BoxPersonaleService) {
    }

    @Selector()
    static interventi(state: BoxesStateModel) {
        return state.interventi;
    }

    @Selector()
    static mezzi(state: BoxesStateModel) {
        return state.mezzi;
    }

    @Selector()
    static personale(state: BoxesStateModel) {
        return state.personale;
    }

    // INTERVENTI
    @Action(FetchBoxInterventi)
    getInterventi({ dispatch }: StateContext<BoxesStateModel>) {
        // tslint:disable-next-line:max-line-length
        let interventi: BoxInterventi;

        this._richieste.getInterventi().subscribe((i: BoxInterventi) => {
            interventi = i;

            dispatch(new SetBoxInterventi(interventi));
        });
    }

    @Action(SetBoxInterventi)
    setInterventi({ getState, patchState }: StateContext<BoxesStateModel>, action: SetBoxInterventi) {
        const state = getState();

        patchState({
            ...state,
            interventi: action.payload
        });
    }

    // MEZZI
    @Action(FetchBoxMezzi)
    getMezzi({ dispatch }: StateContext<BoxesStateModel>) {
        let mezzi: BoxMezzi;

        this._mezzi.getMezzi().subscribe((m: BoxMezzi) => {
            mezzi = m;

            dispatch(new SetBoxMezzi(mezzi));
        });
    }

    @Action(SetBoxMezzi)
    setMezzi({ getState, patchState }: StateContext<BoxesStateModel>, action: SetBoxMezzi) {
        const state = getState();

        patchState({
            ...state,
            mezzi: action.payload
        });
    }

    // PERSONALE
    @Action(FetchBoxPersonale)
    getPersonale({ dispatch }: StateContext<BoxesStateModel>) {
        let personale: BoxPersonale;

        this._personale.getPersonale().subscribe((p: BoxPersonale) => {
            personale = p;

            dispatch(new SetBoxPersonale(personale));
        });
    }

    @Action(SetBoxPersonale)
    setPersonale({ getState, patchState }: StateContext<BoxesStateModel>, action: SetBoxPersonale) {
        const state = getState();

        patchState({
            ...state,
            personale: action.payload
        });
    }
}
