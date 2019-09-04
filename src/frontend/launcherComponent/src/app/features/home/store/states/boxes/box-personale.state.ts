import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BoxPersonale } from '../../../boxes/boxes-model/box-personale.model';
import { ClearBoxPersonale, SetBoxPersonale, SetBoxPersonalePresenze, SetBoxPersonaleQty } from '../../actions/boxes/box-personale.actions';
import { BoxPersonalePersona, BoxPersonalePresenze, BoxPersonaleQty } from '../../../../../shared/interface/box-personale.interface';
import { BoxFunzionariSo } from '../../../boxes/boxes-model/box-funzionari-so.model';

export interface BoxPersonaleStateModel {
    personale: BoxPersonale;
    presenze: BoxPersonalePresenze;
    personaleQty: BoxPersonaleQty;
}

export const boxPersonaleStateDefaults: BoxPersonaleStateModel = {
    personale: null,
    presenze: null,
    personaleQty: null
};

@State<BoxPersonaleStateModel>({
    name: 'boxPersonale',
    defaults: boxPersonaleStateDefaults
})
export class BoxPersonaleState {

    constructor() {
    }

    @Selector()
    static personale(state: BoxPersonaleStateModel) {
        return state.personale;
    }

    @Selector()
    static personaleQty(state: BoxPersonaleStateModel) {
        return state.personaleQty;
    }

    @Selector()
    static presenze(state: BoxPersonaleStateModel) {
        return state.presenze;
    }

    @Action(SetBoxPersonale)
    setBoxPersonale({ patchState, dispatch }: StateContext<BoxPersonaleStateModel>, action: SetBoxPersonale) {
        patchState({
            personale: action.payload
        });
        dispatch(new SetBoxPersonaleQty(countPersonale(action.payload)));
        dispatch(new SetBoxPersonalePresenze(getPresenze(action.payload)));
    }

    @Action(SetBoxPersonaleQty)
    setBoxPersonaleQty({ patchState }: StateContext<BoxPersonaleStateModel>, action: SetBoxPersonaleQty) {
        patchState({
            personaleQty: action.personaleQty
        });
    }

    @Action(SetBoxPersonalePresenze)
    setBoxPersonalePresenze({ patchState }: StateContext<BoxPersonaleStateModel>, action: SetBoxPersonalePresenze) {
        patchState({
            presenze: action.personalePresenze
        });
    }

    @Action(ClearBoxPersonale)
    clearBoxPersonale({ patchState }: StateContext<BoxPersonaleStateModel>) {
        patchState(boxPersonaleStateDefaults);
    }
}

export function countPersonale(state: BoxPersonale): BoxPersonaleQty {
    const personaleQty = {} as BoxPersonaleQty;
    if (state) {
        personaleQty.funzionari = 0;
        personaleQty.tecnici = 0;
        state.funzionari.forEach((result: BoxFunzionariSo) => {
            if (result.funzGuardia || result.capoTurno) {
                personaleQty.funzionari++;
            }
            if (result.tecnicoGuardia1 || result.tecnicoGuardia2) {
                personaleQty.tecnici++;
            }
        });
        personaleQty.squadreAssegnate = state.squadreAssegnate;
        personaleQty.squadreServizio = state.squadreServizio;
        personaleQty.totale = state.personaleTotale;
    }
    return personaleQty;
}

export function getPresenze(state: BoxPersonale): BoxPersonalePresenze {
    const personalePresenze = {} as BoxPersonalePresenze;
    if (state) {
        state.funzionari.forEach((result: BoxFunzionariSo) => {
            if (result.funzGuardia) {
                personalePresenze.funzGuardia = makeBoxPersonalePersona(result);
            } else if (result.capoTurno) {
                personalePresenze.capoTurno = makeBoxPersonalePersona(result);
            } else if (result.tecnicoGuardia1) {
                personalePresenze.tecnicoGuardia1 = makeBoxPersonalePersona(result);
            } else if (result.tecnicoGuardia2) {
                personalePresenze.tecnicoGuardia2 = makeBoxPersonalePersona(result);
            }
        });
    }
    return personalePresenze;
}

export function makeBoxPersonalePersona(boxFunzionarioSo: BoxFunzionariSo): BoxPersonalePersona {
    if (boxFunzionarioSo) {
        return {
            descrizione: boxFunzionarioSo.descrizione,
            qualifica: boxFunzionarioSo.qualifica,
            telefono: boxFunzionarioSo.telefono
        } as BoxPersonalePersona;
    }
}
