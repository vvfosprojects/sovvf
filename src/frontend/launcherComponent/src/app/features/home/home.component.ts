import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Grids, ViewInterfaceButton, ViewInterfaceMaps, ViewLayouts } from '../../shared/interface/view.interface';
import { Select, Store } from '@ngxs/store';
import { ViewComponentState } from './store/states/view/view.state';
import { Composizione } from '../../shared/enum/composizione.enum';
import { GetUtenti } from './store/actions/utenti/utenti.actions';
import { ClearDataHome, GetDataHome, SetMapLoaded } from './store/actions/home.actions';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {

    subscription = new Subscription();
    viewState: ViewLayouts;
    columnState: Grids;
    loading = true;

    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;
    @Select(ViewComponentState.columnGrid) columnState$: Observable<Grids>;
    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;
    @Select(ViewComponentState.colorButton) colorButton$: Observable<ViewInterfaceButton>;
    @Select(ViewComponentState.viewStateMaps) viewStateMappa$: Observable<ViewInterfaceMaps>;

    constructor(private store: Store) {
        this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
        this.subscription.add(this.columnState$.subscribe(r => this.columnState = r));
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Home creato');
        /**
         * importante: non mettere nel costruttore
         */
        this.store.dispatch(new GetUtenti());
        this.store.dispatch(new GetDataHome());
    }

    ngOnDestroy() {
        isDevMode() && console.log('Componente Home distrutto');
        this.subscription.unsubscribe();
        this.store.dispatch(new ClearDataHome());
    }

    onMapFullLoaded() {
        this.loading = false;
        this.store.dispatch(new SetMapLoaded());
    }

}
