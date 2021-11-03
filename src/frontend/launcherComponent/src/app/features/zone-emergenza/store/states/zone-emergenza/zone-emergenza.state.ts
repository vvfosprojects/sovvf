import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { ZonaEmergenza } from '../../../../../shared/model/zona-emergenza.model';
import { ZoneEmergenzaService } from '../../../../../core/service/zone-emergenza-service/zone-emergenza.service';
import { GetZoneEmergenza, SetZoneEmergenza, StartLoadingZoneEmergenza, StopLoadingZoneEmergenza } from '../../actions/zone-emergenza/zone-emergenza.actions';

export interface ZoneEmergenzaStateModel {
    zoneEmergenza: ZonaEmergenza[];
    loadingZoneEmergenza: boolean;
}

export const ZoneEmergenzaStateModelDefaults: ZoneEmergenzaStateModel = {
    zoneEmergenza: undefined,
    loadingZoneEmergenza: false
};

@Injectable()
@State<ZoneEmergenzaStateModel>({
    name: 'zoneEmergenza',
    defaults: ZoneEmergenzaStateModelDefaults,
})
export class ZoneEmergenzaState {

    constructor(private store: Store,
                private zoneEmergenzaService: ZoneEmergenzaService) {
    }

    @Selector()
    static zoneEmergenza(state: ZoneEmergenzaStateModel): any[] {
        return state.zoneEmergenza;
    }

    @Selector()
    static loadingZoneEmergenza(state: ZoneEmergenzaStateModel): boolean {
        return state.loadingZoneEmergenza;
    }

    @Action(GetZoneEmergenza)
    getZoneEmergenza({ dispatch }: StateContext<ZoneEmergenzaStateModel>, action: GetZoneEmergenza): void {
        dispatch(new StartLoadingZoneEmergenza());
        const pagination = {
            page: action.page ? action.page : 1,
            pageSize: this.store.selectSnapshot(PaginationState.pageSize)
        };
        this.zoneEmergenzaService.getZoneEmergenza(pagination).subscribe((response: ResponseInterface) => {
            dispatch([
                new PatchPagination(response.pagination),
                new SetZoneEmergenza(response.dataArray),
                new StopLoadingZoneEmergenza()
            ]);
        }, error => {
            dispatch(new StopLoadingZoneEmergenza());
        });
    }

    @Action(SetZoneEmergenza)
    setPos({ patchState }: StateContext<ZoneEmergenzaStateModel>, action: SetZoneEmergenza): void {
        patchState({
            zoneEmergenza: action.zoneEmergenza
        });
    }

    @Action(StartLoadingZoneEmergenza)
    startLoadingPos({ patchState }: StateContext<ZoneEmergenzaStateModel>): void {
        patchState({
            loadingZoneEmergenza: true
        });
    }

    @Action(StopLoadingZoneEmergenza)
    stopLoadingPos({ patchState }: StateContext<ZoneEmergenzaStateModel>): void {
        patchState({
            loadingZoneEmergenza: false
        });
    }
}
