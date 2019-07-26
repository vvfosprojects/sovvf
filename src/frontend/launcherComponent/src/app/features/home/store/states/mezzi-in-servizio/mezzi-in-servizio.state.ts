import { State, Selector, Action, StateContext } from '@ngxs/store';
import { GetMezziInServizio, SetMezziInServizio } from '../../actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { MezziInServizioService } from 'src/app/core/service/mezzi-in-servizio-service/mezzi-in-servizio.service';
import { Mezzo } from 'src/app/shared/model/mezzo.model';

export interface MezziInServizioStateModel {
    mezziInServizio: Mezzo[];
}

export const MezziInServizioStateDefaults: MezziInServizioStateModel = {
    mezziInServizio: null
};

@State<MezziInServizioStateModel>({
    name: 'mezziInServizio',
    defaults: MezziInServizioStateDefaults
})

export class MezziInServizioState {

    constructor(private mezziInServizioService: MezziInServizioService) {
    }

    @Selector()
    static mezziInServizio(state: MezziInServizioStateModel) {
        return state.mezziInServizio;
    }

    @Action(GetMezziInServizio)
    getMezziInServizio({ dispatch }: StateContext<MezziInServizioStateModel>) {
        this.mezziInServizioService.getMezziInServizio().subscribe(data => {
            console.log('Mezzi In Servizio Controller', data);
            dispatch(new SetMezziInServizio(data.listaMezzi));
        });
    }

    @Action(SetMezziInServizio)
    setMezziInServizio({ patchState }: StateContext<MezziInServizioStateModel>, action: SetMezziInServizio) {
        patchState({
            'mezziInServizio': action.mezzi
        });
    }

}
