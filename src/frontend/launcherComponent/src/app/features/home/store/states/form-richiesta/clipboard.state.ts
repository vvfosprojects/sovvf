import { Action, State, StateContext } from '@ngxs/store';
import { ClipboardService } from 'ngx-clipboard';
import { ClearClipboard, CopyToClipboard } from '../../actions/form-richiesta/clipboard.actions';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { Injectable } from '@angular/core';

export interface ClipboardStateModel {
    clipboard: string;
}

export const ClipboardStateDefaults: ClipboardStateModel = {
    clipboard: null
};

@Injectable()
@State<ClipboardStateModel>({
    name: 'clipboard',
    defaults: ClipboardStateDefaults
})

export class ClipboardState {

    constructor(private clipboardService: ClipboardService) {
    }


    @Action(CopyToClipboard)
    copyToClipboard({ patchState }: StateContext<ClipboardStateModel>, action: CopyToClipboard): void {
        patchState({
            clipboard: this.toClipboard(action.coordinate)
        });
    }

    @Action(ClearClipboard)
    clearClipboard({ patchState }: StateContext<ClipboardStateModel>): void {
        patchState(ClipboardStateDefaults);
    }

    toClipboard(coordinate: Coordinate): string {
        const copiedText = coordinate.latitudine.toString() + ', ' + coordinate.longitudine.toString();
        this.clipboardService.copyFromContent(copiedText);
        return copiedText;
    }

}
