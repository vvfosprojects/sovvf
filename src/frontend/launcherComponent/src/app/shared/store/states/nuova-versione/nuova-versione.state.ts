import { Action, Selector, State, StateContext } from '@ngxs/store';
import { OpenModalNewFeaturesInfo, GetNewVersion, OpenModalNewVersionSoon, SetCurrentVersion, SetNewVersion } from '../../actions/nuova-versione/nuova-versione.actions';
import { ShowToastr } from '../../actions/toastr/toastr.actions';
import { ToastrType } from '../../../enum/toastr';
import { VersionInterface } from '../../../interface/version.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable, NgZone } from '@angular/core';
import { AnnuncioNuovaVersioneModalComponent } from '../../../modal/annuncio-nuova-versione-modal/annuncio-nuova-versione-modal.component';
import { VersionSoonInterface } from '../../../interface/version-soon.interface';
import { NuoveFeaturesInfoModalComponent } from '../../../modal/nuove-features-info-modal/nuove-features-info-modal.component';

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

    constructor(private modalService: NgbModal,
                private ngZone: NgZone) {
    }

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

    @Action(OpenModalNewVersionSoon)
    openModalNewVersionSoon({ getState }: StateContext<NewVersionStateModel>): void {
        const state = getState();
        this.ngZone.run(() => {
            const newVersionSoonModal = this.modalService.open(AnnuncioNuovaVersioneModalComponent, {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            });
            newVersionSoonModal.componentInstance.newVersionSoonInfo = state.newVersionSoon.nuoveFeatures;
            newVersionSoonModal.componentInstance.newVersionSoonData = state.newVersionSoon.data;
        });
    }

    @Action(OpenModalNewFeaturesInfo)
    openModalNewFeaturesInfo({ getState }: StateContext<NewVersionStateModel>): void {
        const state = getState();
        this.ngZone.run(() => {
            const newFeaturesInfoModal = this.modalService.open(NuoveFeaturesInfoModalComponent, {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            });
            // newVersionSoonModal.componentInstance.newVersionSoonInfo = state.newVersionSoon.nuoveFeatures;
            // newVersionSoonModal.componentInstance.newVersionSoonData = state.newVersionSoon.data;
        });
    }
}
