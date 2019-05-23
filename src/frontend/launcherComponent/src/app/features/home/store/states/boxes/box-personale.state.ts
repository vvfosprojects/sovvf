import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BoxPersonaleService } from 'src/app/core/service/boxes-service/box-personale.service';
import { BoxPersonale } from '../../../boxes/boxes-model/box-personale.model';
import { ClearBoxPersonale, GetBoxPersonale, SetBoxPersonale, SetBoxPersonalePresenze, SetBoxPersonaleQty } from '../../actions/boxes/box-personale.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { BoxPersonalePresenze, BoxPersonaleQty } from '../../../../../shared/interface/box-personale.interface';
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

    constructor(private _personale: BoxPersonaleService) {
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

    @Action(GetBoxPersonale)
    getBoxPersonale({ dispatch }: StateContext<BoxPersonaleStateModel>) {
        this._personale.getPersonale().subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
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
                personalePresenze.funzGuardia = {
                    descrizione: result.descrizione,
                    qualifica: result.qualifica
                };
            } else if (result.capoTurno) {
                personalePresenze.capoTurno = {
                    descrizione: result.descrizione,
                    qualifica: result.qualifica
                };
            } else if (result.tecnicoGuardia1) {
                personalePresenze.tecnicoGuardia1 = {
                    descrizione: result.descrizione,
                    qualifica: result.qualifica
                };
            } else if (result.tecnicoGuardia2) {
                personalePresenze.tecnicoGuardia2 = {
                    descrizione: result.descrizione,
                    qualifica: result.qualifica
                };
            }
        });
    }
    return personalePresenze;
}
