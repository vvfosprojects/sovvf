import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { CasLogin } from './store/auth.actions';

@Component({
    selector: 'app-login',
    template: ``
})
export class LoginComponent {
    constructor(private store: Store) {
        this.store.dispatch(new CasLogin());
    }
}
