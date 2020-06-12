import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { CasResponse } from './store/auth.actions';

@Component({
    selector: 'app-cas-logged',
    template: ``
})
export class CasLoggedComponent {
    constructor(private store: Store) {
        this.store.dispatch(new CasResponse(refactorUrl(window.location.href)));
    }
}

function refactorUrl(url: string): string {
    return url.split('?ticket=')[1];
}
