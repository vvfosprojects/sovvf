import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BoxPersonale } from '../../../boxes/boxes-model/box-personale.model';
import { ClearBoxPersonale, SetBoxPersonaleCurrent, SetBoxPersonalePresenzeCurrent, SetBoxPersonaleQtyCurrent } from '../../actions/boxes/box-personale.actions';
import { BoxPersonalePersona, BoxPersonalePresenze, BoxPersonaleQty } from '../../../../../shared/interface/box-personale.interface';
import { BoxFunzionariSo } from '../../../boxes/boxes-model/box-funzionari-so.model';
import { Injectable } from '@angular/core';
import { RuoloFunzionarioSo } from '../../../boxes/boxes-model/ruolo-funzionario-so.enum';

export interface BoxPersonaleStateModel {
    personalePrevious: BoxPersonale;
    presenzePrevious: BoxPersonalePresenze;
    personaleQtyPrevious: BoxPersonaleQty;
    personaleCurrent: BoxPersonale;
    presenzeCurrent: BoxPersonalePresenze;
    personaleQtyCurrent: BoxPersonaleQty;
    personaleNext: BoxPersonale;
    presenzeNext: BoxPersonalePresenze;
    personaleQtyNext: BoxPersonaleQty;
}

export const boxPersonaleStateDefaults: BoxPersonaleStateModel = {
    personalePrevious: null,
    presenzePrevious: null,
    personaleQtyPrevious: null,
    personaleCurrent: null,
    presenzeCurrent: null,
    personaleQtyCurrent: null,
    personaleNext: null,
    presenzeNext: null,
    personaleQtyNext: null
};

@Injectable()
@State<BoxPersonaleStateModel>({
    name: 'boxPersonale',
    defaults: boxPersonaleStateDefaults
})
export class BoxPersonaleState {

    @Selector()
    static personalePrevious(state: BoxPersonaleStateModel): BoxPersonale {
        return state.personalePrevious;
    }

    @Selector()
    static presenzePrevious(state: BoxPersonaleStateModel): BoxPersonalePresenze {
        return state.presenzePrevious;
    }

    @Selector()
    static personaleQtyPrevious(state: BoxPersonaleStateModel): BoxPersonaleQty {
        return state.personaleQtyPrevious;
    }

    @Selector()
    static personaleCurrent(state: BoxPersonaleStateModel): BoxPersonale {
        return state.personaleCurrent;
    }

    @Selector()
    static presenzeCurrent(state: BoxPersonaleStateModel): BoxPersonalePresenze {
        return state.presenzeCurrent;
    }

    @Selector()
    static personaleQtyCurrent(state: BoxPersonaleStateModel): BoxPersonaleQty {
        return state.personaleQtyCurrent;
    }

    @Selector()
    static personaleNext(state: BoxPersonaleStateModel): BoxPersonale {
        return state.personaleNext;
    }

    @Selector()
    static presenzeNext(state: BoxPersonaleStateModel): BoxPersonalePresenze {
        return state.presenzeNext;
    }

    @Selector()
    static personaleQtyNext(state: BoxPersonaleStateModel): BoxPersonaleQty {
        return state.personaleQtyNext;
    }

    @Action(SetBoxPersonaleCurrent)
    setBoxPersonale({ patchState, dispatch }: StateContext<BoxPersonaleStateModel>, action: SetBoxPersonaleCurrent): void {
        patchState({
            personaleCurrent: action.payload
        });
        dispatch(new SetBoxPersonaleQtyCurrent(countPersonale(action.payload, 'current')));
        dispatch(new SetBoxPersonalePresenzeCurrent(getPresenze(action.payload, 'current')));
    }

    @Action(SetBoxPersonalePresenzeCurrent)
    setBoxPersonalePresenze({ patchState }: StateContext<BoxPersonaleStateModel>, action: SetBoxPersonalePresenzeCurrent): void {
        patchState({
            presenzeCurrent: action.personalePresenze
        });
    }

    @Action(SetBoxPersonaleQtyCurrent)
    setBoxPersonaleQty({ patchState }: StateContext<BoxPersonaleStateModel>, action: SetBoxPersonaleQtyCurrent): void {
        patchState({
            personaleQtyCurrent: action.personaleQty
        });
    }

    @Action(ClearBoxPersonale)
    clearBoxPersonale({ patchState }: StateContext<BoxPersonaleStateModel>): void {
        patchState(boxPersonaleStateDefaults);
    }
}

export function countPersonale(state: BoxPersonale, type: string): BoxPersonaleQty {
    const personaleQty = {} as BoxPersonaleQty;
    if (state) {
        personaleQty.funzionari = 0;
        personaleQty.tecnici = 0;
        state.funzionari[type]?.forEach((result: BoxFunzionariSo) => {
            switch (result.ruolo) {
                case RuoloFunzionarioSo.Guardia:
                    personaleQty.funzionari++;
                    break;
                case RuoloFunzionarioSo.CapoTurno:
                    personaleQty.funzionari++;
                    break;
                case RuoloFunzionarioSo.PrimoTecnico:
                    personaleQty.tecnici++;
                    break;
                case RuoloFunzionarioSo.SecondoTecnico:
                    personaleQty.tecnici++;
                    break;
                default:
                    console.error('countPersonale => Ruolo funzionario non gestito nello switch');
                    break;
            }
        });
        personaleQty.squadreAssegnate = state.squadreAssegnate;
        personaleQty.squadreServizio = state.squadreServizio[type];
        personaleQty.totale = state.personaleTotale[type];
    }
    return personaleQty;
}

export function getPresenze(state: BoxPersonale, type: string): BoxPersonalePresenze {
    const personalePresenze = {} as BoxPersonalePresenze;
    if (state) {
        state.funzionari[type]?.forEach((result: BoxFunzionariSo) => {
            switch (result.ruolo) {
                case RuoloFunzionarioSo.Guardia:
                    if(!personalePresenze.guardia) {
                        personalePresenze.guardia = [];
                    }
                    personalePresenze.guardia.push(makeBoxPersonalePersona(result));
                    break;
                case RuoloFunzionarioSo.CapoTurno:
                    if(!personalePresenze.capoTurno) {
                        personalePresenze.capoTurno = [];
                    }
                    personalePresenze.capoTurno.push(makeBoxPersonalePersona(result));
                    break;
                case RuoloFunzionarioSo.PrimoTecnico:
                    personalePresenze.primoTecnico = makeBoxPersonalePersona(result);
                    break;
                case RuoloFunzionarioSo.SecondoTecnico:
                    personalePresenze.secondoTecnico = makeBoxPersonalePersona(result);
                    break;
                default:
                    console.error('getPresenze => Ruolo funzionario non gestito nello switch');
                    break;
            }
        });
    }
    return personalePresenze;
}

export function makeBoxPersonalePersona(boxFunzionarioSo: BoxFunzionariSo): BoxPersonalePersona {
    if (boxFunzionarioSo) {
        return {
            descrizione: boxFunzionarioSo.nominativo,
            qualifica: boxFunzionarioSo.descrizioneQualifica
        } as BoxPersonalePersona;
    }
}
