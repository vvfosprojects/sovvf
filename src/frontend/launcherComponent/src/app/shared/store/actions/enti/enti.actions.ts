import { Enti } from 'src/app/shared/interface/ente.interface';



export class GetEnti  {
    static readonly type = '[Enti] Get Enti';

    constructor() {
    }
}

export class SetEnti  {
    static readonly type = '[Enti] Set Enti';

    constructor(public enti: Enti[]) {
    }
}

export class UpdateEnti {
    static readonly type = '[Enti] Update Enti';

    constructor(public enti: Enti[]) {
    }
}

export class DeleteEnti {
    static readonly type = '[Enti] Delete Enti';
}
