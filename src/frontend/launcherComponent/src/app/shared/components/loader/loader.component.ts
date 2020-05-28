import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from '../../store/states/app/app.state';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: [ './loader.component.css' ]
})
export class LoaderComponent implements OnInit, OnDestroy {

    private subscription = new Subscription();
    isReady: boolean;

    @Select(AppState.appIsLoaded) isLoaded$: Observable<boolean>;

    constructor() {
        this.subscription.add(this.isLoaded$.subscribe((r: boolean) => this.isReady = r));
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
