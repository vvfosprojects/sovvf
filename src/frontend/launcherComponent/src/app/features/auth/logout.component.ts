import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Logout } from './store/auth.actions';

@Component({
    selector: 'app-logout',
    template: ``
})
export class LogoutComponent {
    constructor(private store: Store) {
        this.store.dispatch(new Logout());
    }
}
