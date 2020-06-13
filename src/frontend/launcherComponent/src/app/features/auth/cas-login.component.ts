import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { CasLogin } from './store/auth.actions';

@Component({ template: `` })
export class CasLoginComponent {
    constructor(private store: Store) {
        this.store.dispatch(new CasLogin());
    }
}
