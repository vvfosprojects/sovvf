import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../../shared/store/states/app/app.state';
import { Navigate } from '@ngxs/router-plugin';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';

@Component({ templateUrl: './logged.component.html' })
export class LoggedComponent implements OnInit, OnDestroy {

    @Select(AppState.previousUrl) previousUrl$: Observable<string>;

    private subscription = new Subscription();

    constructor(private store: Store) {
        this.getPreviousUrl();
    }

    ngOnInit(): void {
        this.store.dispatch(new StopBigLoading());
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getPreviousUrl(): void {
        this.subscription.add(
            this.previousUrl$.subscribe(res => {
                if (res) {
                    this.store.dispatch(new Navigate([`/${res}`]));
                }
            })
        );
    }

}
