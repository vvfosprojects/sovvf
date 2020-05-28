import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../../shared/store/states/app/app.state';
import { Navigate } from '@ngxs/router-plugin';

@Component({ templateUrl: './logged.component.html' })
export class LoggedComponent implements OnInit, OnDestroy {

    private subscription = new Subscription();

    @Select(AppState.previusUrl) previusUrl$: Observable<string>;

    constructor(private store: Store) {
    }

    ngOnInit() {
        this.subscription.add(this.previusUrl$.subscribe(res => {
            if (res) {
                this.store.dispatch(new Navigate([`/${res}`]));
            }
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
