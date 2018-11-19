import { Sede } from '../../../shared/model/sede.model';

export class GetTextSedi {
    constructor(private unitaOperative: Sede[]) {
    }

    textSedi(value: string) {
        console.log(value);
    }
}
