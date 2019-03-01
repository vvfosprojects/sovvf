import { Action, State, Store } from '@ngxs/store';
import { ClipboardService } from 'ngx-clipboard';
import { CopyToClipboard } from '../../actions/chiamata/clipboard.actions';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { SchedaTelefonataState } from './scheda-telefonata.state';

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

    constructor(private store: Store,
                private _clipboardService: ClipboardService) {
    }


    @Action(CopyToClipboard)
    copyToClipboard() {
        const coordinate = this.store.selectSnapshot(SchedaTelefonataState.coordinate);
        this.toClipboard(coordinate);
    }

    toClipboard(coordinate: Coordinate) {
        const copiedText = coordinate.latitudine.toString() + ', ' + coordinate.longitudine.toString();
        this._clipboardService.copyFromContent(copiedText);
    }

}
