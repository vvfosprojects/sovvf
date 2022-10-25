import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable, NgZone } from '@angular/core';
import { OpenAlertModal } from '../../actions/alert-modal/alert-modal.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../../modal/alert-modal/alert-modal.component';

export interface AlertModalStateModel {
    opened: boolean;
}

export const alertModalStateDefaults: AlertModalStateModel = {
    opened: false
};

@Injectable()
@State<AlertModalStateModel>({
    name: 'alertModal',
    defaults: alertModalStateDefaults
})
export class AlertModalState {

    constructor(private ngZone: NgZone,
                private modalService: NgbModal) {
    }

    @Selector()
    static opened(state: AlertModalStateModel): boolean {
        return state.opened;
    }

    @Action(OpenAlertModal)
    openAlertModal({ dispatch }: StateContext<AlertModalStateModel>, action: OpenAlertModal): void {
        this.ngZone.run(() => {
            const alertModal = this.modalService.open(AlertModalComponent, {
                centered: true,
                size: 'md'
            });
            alertModal.componentInstance.title = action.title;
            alertModal.componentInstance.buttons = action.buttons;
            alertModal.componentInstance.innerHTMLBody = action.innerHTMLBody;
            alertModal.componentInstance.timeToClose = action.timeToClose;
        });
    }
}
