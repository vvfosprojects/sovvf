import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Login } from './store/login.actions';

@Component({
    selector: 'app-login',
    template: ``
})
export class LoginComponent {
    constructor(private store: Store) {
        this.store.dispatch(new Login());
    }
}
