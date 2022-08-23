import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Sede } from '../../../model/sede.model';
import { GetDistaccamenti, GetSediAllerta, GetSediTrasferimenti, SetDistaccamenti, SetSediAllerta, SetSediTrasferimenti } from '../../actions/distaccamenti/distaccamenti.actions';
import { DistaccamentiService } from '../../../../core/service/distaccamenti-service/distaccamenti-service';
import { getProvinciaByCodProvincia } from '../../../helper/function-province';

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
        let distaccamenti = action.distaccamenti;
        distaccamenti = distaccamenti.map((d: Sede) => {
            return {
                ...d,
                descrizione: d.descrizione.toLowerCase() === 'centrale' ? d.descrizione + ' ' + getProvinciaByCodProvincia(d.codice.split('.')[0]).toUpperCase() : d.descrizione
            };
        });
        patchState({
            distaccamenti
        });
    }

    @Action(SetSediAllerta)
    setSediAllerta({ patchState }: StateContext<DistaccamentiStateModel>, action: SetSediAllerta): void {
        let sediAllertaFiltered = action.sediAllerta;
        // Filtro per avere solo i comandi, il BE restituisce tutte le sedi
        sediAllertaFiltered = sediAllertaFiltered.filter((s: Sede) => (s.codice.split('.')?.length === 2 && s.codice.split('.')[1] === '1000'));
        sediAllertaFiltered = sediAllertaFiltered.map((d: Sede) => {
            return {
                ...d,
                descrizione: d.descrizione + ' ' + getProvinciaByCodProvincia(d.codice.split('.')[0]).toUpperCase()
            };
        });
        patchState({
            sediAllerta: sediAllertaFiltered
        });
    }

    @Action(SetSediTrasferimenti)
    setSediTrasferimenti({ patchState }: StateContext<DistaccamentiStateModel>, action: SetSediTrasferimenti): void {
        let sediTrasferimenti = action.sediTrasferimenti;
        sediTrasferimenti = sediTrasferimenti.map((d: Sede) => {
            return {
                ...d,
                descrizione: d.descrizione + ' ' + getProvinciaByCodProvincia(d.codice.split('.')[0]).toUpperCase()
            };
        });
        patchState({
            sediTrasferimenti
        });
    }
}
