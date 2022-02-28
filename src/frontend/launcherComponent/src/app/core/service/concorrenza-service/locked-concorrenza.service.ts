import { TipoConcorrenzaEnum } from '../../../shared/enum/tipo-concorrenza.enum';
import { ConcorrenzaState } from '../../../shared/store/states/concorrenza/concorrenza.state';
import { ConcorrenzaInterface } from '../../../shared/interface/concorrenza.interface';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

@Injectable({
    providedIn: 'root'
})
export class LockedConcorrenzaService {

    constructor(private store: Store) {
    }

    getLockedConcorrenza(type: TipoConcorrenzaEnum, value: string): boolean {
        const concorrenza = this.store.selectSnapshot(ConcorrenzaState.concorrenza);
        return concorrenza?.filter((c: ConcorrenzaInterface) => c.type === type && c.value === value)?.length > 0;
    }
}
