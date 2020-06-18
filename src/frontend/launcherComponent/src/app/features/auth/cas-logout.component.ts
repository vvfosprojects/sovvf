import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { ClearCurrentUser } from './store/auth.actions';

@Component({ template: `` })
export class CasLogoutComponent {

    constructor(private store: Store) {
        this.store.dispatch([ new ClearCurrentUser() ]);
    }

}
