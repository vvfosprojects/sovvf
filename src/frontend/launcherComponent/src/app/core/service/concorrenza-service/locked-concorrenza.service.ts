import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../features/auth/store/auth.state';
import { TipoConcorrenzaEnum } from '../../../shared/enum/tipo-concorrenza.enum';
import { ConcorrenzaState } from '../../../shared/store/states/concorrenza/concorrenza.state';
import { ConcorrenzaInterface } from '../../../shared/interface/concorrenza.interface';

@Injectable({
    providedIn: 'root'
})
export class LockedConcorrenzaService {

    constructor(private store: Store) {
    }

    getLockedConcorrenza(type: TipoConcorrenzaEnum, value: string[]): string {
        const currentUser = this.store.selectSnapshot(AuthState.currentUser);
        const concorrenza = this.store.selectSnapshot(ConcorrenzaState.concorrenza) as ConcorrenzaInterface[];
        const concorrenzaFound =  concorrenza?.filter((c: ConcorrenzaInterface) => c.type === type && value.includes(c.value) && c.idOperatore !== currentUser.id)[0];
        return concorrenzaFound ? concorrenzaFound.nominativoOperatore : null;
    }
}
