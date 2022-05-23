import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetNewVersion, SetCurrentVersion, SetNewVersion } from '../../actions/nuova-versione/nuova-versione.actions';
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
    setNewVersion({ patchState }: StateContext<NewVersionStateModel>, { newVersion }: SetNewVersion): void {
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
