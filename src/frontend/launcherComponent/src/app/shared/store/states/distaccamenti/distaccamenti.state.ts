import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Sede } from '../../../model/sede.model';
import { GetDistaccamenti, GetSediAllerta, GetSediTrasferimenti, SetDistaccamenti, SetSediAllerta, SetSediTrasferimenti } from '../../actions/distaccamenti/distaccamenti.actions';
import { DistaccamentiService } from '../../../../core/service/distaccamenti-service/distaccamenti-service';

export interface DistaccamentiStateModel {
    distaccamenti: Sede[];
    sediAllerta: Sede[];
    sediTrasferimenti: Sede[];
}

export const DistaccamentiStateDefaults: DistaccamentiStateModel = {
    distaccamenti: null,
    sediAllerta: null,
    sediTrasferimenti: null,
};

@Injectable()
@State<DistaccamentiStateModel>({
    name: 'distaccamenti',
    defaults: DistaccamentiStateDefaults
})

export class DistaccamentiState {

    constructor(private distaccamentiService: DistaccamentiService) {
    }

    @Selector()
    static distaccamenti(state: DistaccamentiStateModel): Sede[] {
        return state.distaccamenti;
    }

    @Selector()
    static sediAllerta(state: DistaccamentiStateModel): Sede[] {
        return state.sediAllerta;
    }

    @Selector()
    static sediTrasferimenti(state: DistaccamentiStateModel): Sede[] {
        return state.sediTrasferimenti;
    }

    @Action(GetDistaccamenti)
    getDistaccamenti({ dispatch }: StateContext<DistaccamentiStateModel>): void {
        this.distaccamentiService.getDistaccamenti().subscribe((data: Sede[]) => {
            dispatch(new SetDistaccamenti(data));
        });
    }

    @Action(GetSediAllerta)
    getSediAllerta({ dispatch }: StateContext<DistaccamentiStateModel>): void {
        this.distaccamentiService.getSediAllerta().subscribe((data: Sede[]) => {
            dispatch(new SetSediAllerta(data));
        });
    }

    @Action(GetSediTrasferimenti)
    getSediTrasferimenti({ dispatch }: StateContext<DistaccamentiStateModel>): void {
        this.distaccamentiService.getSediTrasferimenti().subscribe((data: Sede[]) => {
            dispatch(new SetSediTrasferimenti(data));
        });
    }

    @Action(SetDistaccamenti)
    setDistaccamenti({ patchState }: StateContext<DistaccamentiStateModel>, action: SetDistaccamenti): void {
        patchState({
            distaccamenti: action.distaccamenti
        });
    }

    @Action(SetSediAllerta)
    setSediAllerta({ patchState }: StateContext<DistaccamentiStateModel>, action: SetSediAllerta): void {
        let sediAllertaFiltered = action.sediAllerta;
        // Filtro per avere solo i comandi, il BE restituisce tutte le sedi
        sediAllertaFiltered = sediAllertaFiltered.filter((s: Sede) => s.codice.split('.')?.length === 2 && s.codice.split('.')[1] === '1000');
        // Rimuovo la centrale
        sediAllertaFiltered = sediAllertaFiltered.filter((s: Sede) => s.descrizione?.toLowerCase() !== 'centrale');
        patchState({
            sediAllerta: sediAllertaFiltered
        });
    }

    @Action(SetSediTrasferimenti)
    setSediTrasferimenti({ patchState }: StateContext<DistaccamentiStateModel>, action: SetSediTrasferimenti): void {
        let sediTrasferimentiFiltered = action.sediTrasferimenti;
        // Rimuovo la centrale
        sediTrasferimentiFiltered = sediTrasferimentiFiltered.filter((s: Sede) => s.descrizione?.toLowerCase() !== 'centrale');
        patchState({
            sediTrasferimenti: sediTrasferimentiFiltered
        });
    }
}
