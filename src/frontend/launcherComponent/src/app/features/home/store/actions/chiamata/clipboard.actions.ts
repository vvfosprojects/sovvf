import { Coordinate } from '../../../../../shared/model/coordinate.model';

export class CopyToClipboard {
    static readonly type = '[CopyToClipboard] Coordinate copiate negli appunti';

    constructor(public coordinate: Coordinate) {
    }

}

export class ClearClipboard {
    static readonly type = '[CopyToClipboard] Reset appunti';
}
