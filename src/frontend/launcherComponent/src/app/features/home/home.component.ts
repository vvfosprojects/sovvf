import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Grids, ViewInterfaceButton, ViewInterfaceMaps, ViewLayouts } from '../../shared/interface/view.interface';
import { Select } from '@ngxs/store';
import { ViewComponentState } from './store/states/view.state';
import { Composizione } from '../../shared/enum/composizione.enum';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {

    subscription = new Subscription();
    viewState: ViewLayouts;
    columnState: Grids;

    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;
    @Select(ViewComponentState.columnGrid) columnState$: Observable<Grids>;
    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;
    @Select(ViewComponentState.colorButton) colorButton$: Observable<ViewInterfaceButton>;
    @Select(ViewComponentState.viewStateMaps) viewStateMappa$: Observable<ViewInterfaceMaps>;

    constructor() {
        this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
        this.subscription.add(this.columnState$.subscribe(r => this.columnState = r));
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Home creato');
    }

    ngOnDestroy() {
        isDevMode() && console.log('Componente Home distrutto');
        this.subscription.unsubscribe();
    }

}
