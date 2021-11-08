import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetNewVersion, SetCurrentVersion, SetNewVersion } from '../../actions/nuova-versione/nuova-versione.actions';
import { ShowToastr } from '../../actions/toastr/toastr.actions';
import { ToastrType } from '../../../enum/toastr';
import { VersionInterface } from '../../../interface/version.interface';
import { Injectable } from '@angular/core';
import { VersionSoonInterface } from '../../../interface/version-soon.interface';

export interface NewVersionStateModel {
    currentVersion: VersionInterface;
    newVersion: VersionInterface;
    newVersionSoon: VersionSoonInterface;
    newFeaturesInfo: boolean;
}

export const NewVersionStateModelDefaults: NewVersionStateModel = {
    currentVersion: null,
    newVersion: null,
    newVersionSoon: null,
    newFeaturesInfo: true
};

@Injectable()
@State<NewVersionStateModel>({
    name: 'newVersion',
    defaults: NewVersionStateModelDefaults
})
export class NewVersionState {

    @Selector()
    static newVersion(state: NewVersionStateModel): boolean {
        return state.newVersion && (state.newVersion.hash !== state.currentVersion.hash);
    }

    @Selector()
    static newVersionSoon(state: NewVersionStateModel): boolean {
        return !!state.newVersionSoon;
    }

    @Selector()
    static newVersionSoonInfo(state: NewVersionStateModel): string[] {
        return state.newVersionSoon ? state.newVersionSoon.nuoveFeatures : null;
    }

    @Selector()
    static newFeaturesInfo(state: NewVersionStateModel): boolean {
        return state.newFeaturesInfo;
    }

    @Selector()
    static version(state: NewVersionStateModel): VersionInterface {
        return state.currentVersion;
    }

    @Action(SetNewVersion)
    setNewVersion({ getState, patchState, dispatch }: StateContext<NewVersionStateModel>, { newVersion }: SetNewVersion): void {
        const state = getState();
        if (state.newVersion && state.newVersion.hash !== newVersion.hash) {
            dispatch(new ShowToastr(ToastrType.Info, 'Nuova versione disponibile!', 'Premi sul bottone in alto per aggiornare l\'applicazione', 5, true, true));
        }
        patchState({ newVersion });
    }

    @Action(SetCurrentVersion)
    setCurrentVersion({ getState, patchState, dispatch }: StateContext<NewVersionStateModel>, { currentVersion }: SetCurrentVersion): void {
        patchState({ currentVersion });
    }

    @Action(GetNewVersion)
    getNewVersion(): void {
        window.location.reload();
    }
}
