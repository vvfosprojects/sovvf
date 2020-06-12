import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { ClearAuth } from './store/auth.actions';
import { Navigate } from '@ngxs/router-plugin';

@Component({
    selector: 'app-cas-logout',
    template: ``
})
export class CasLogoutComponent {

    constructor(private store: Store) {
        this.store.dispatch([ new ClearAuth(), new Navigate([ '/' ]) ]);
    }

}
