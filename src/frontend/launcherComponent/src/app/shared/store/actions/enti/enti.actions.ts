import { VoceRubrica } from 'src/app/shared/interface/rubrica.interface';

export class SetEnti  {
    static readonly type = '[Enti] Set Enti';

    constructor(public enti: VoceRubrica[]) {
    }
}
