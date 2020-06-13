import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { ClearCurrentUser } from './store/auth.actions';

@Component({
    selector: 'app-cas-logout',
    template: ``
})
export class CasLogoutComponent {

    constructor(private store: Store) {
        this.store.dispatch([ new ClearCurrentUser() ]);
    }

}
