import { Action, State, StateContext } from '@ngxs/store';
import { ClipboardService } from 'ngx-clipboard';
import { ClearClipboard, CopyToClipboard } from '../../actions/chiamata/clipboard.actions';
import { Coordinate } from '../../../../../shared/model/coordinate.model';

export interface ClipboardStateModel {
    clipboard: string;
}

export const ClipboardStateDefaults: ClipboardStateModel = {
    clipboard: null
};

@State<ClipboardStateModel>({
    name: 'clipboard',
    defaults: ClipboardStateDefaults
})

export class ClipboardState {

    constructor(private _clipboardService: ClipboardService) {
    }


    @Action(CopyToClipboard)
    copyToClipboard({ patchState }: StateContext<ClipboardStateModel>, action: CopyToClipboard) {
        patchState({
            clipboard: this.toClipboard(action.coordinate)
        });
    }

    @Action(ClearClipboard)
    clearClipboard({ patchState }: StateContext<ClipboardStateModel>) {
        patchState(ClipboardStateDefaults);
    }

    toClipboard(coordinate: Coordinate): string {
        const copiedText = coordinate.latitudine.toString() + ', ' + coordinate.longitudine.toString();
        this._clipboardService.copyFromContent(copiedText);
        return copiedText;
    }

}
