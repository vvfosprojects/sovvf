import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Grids, ViewInterfaceButton, ViewInterfaceMaps, ViewLayouts } from '../../shared/interface/view.interface';
import { Select, Store } from '@ngxs/store';
import { ViewComponentState } from './store/states/view/view.state';
import { Composizione } from '../../shared/enum/composizione.enum';
import { ClearDataHome, GetDataHome } from './store/actions/home.actions';
import { NavbarState } from '../navbar/store/states/navbar.state';
import { SetMapLoaded } from '../../shared/store/actions/app/app.actions';
import { ImpostazioniState } from '../../shared/store/states/impostazioni/impostazioni.state';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {

    private subscription = new Subscription();
    viewState: ViewLayouts;
    columnState: Grids;

    @Select(NavbarState.navbarIsLoaded) navbarLoaded: Observable<boolean>;

    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;
    @Select(ViewComponentState.columnGrid) columnState$: Observable<Grids>;
    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;
    @Select(ViewComponentState.colorButton) colorButton$: Observable<ViewInterfaceButton>;
    @Select(ViewComponentState.viewStateMaps) viewStateMappa$: Observable<ViewInterfaceMaps>;

    @Select(ImpostazioniState.boxAttivi) boxAttivi$: Observable<boolean>;
    boxAttivi: boolean;

    constructor(private store: Store) {
        this.getViewState();
        this.getColumnState();
        this.getBoxAttivi();
    }

    ngOnInit(): void {
        console.log('Componente Home creato');
        this.store.dispatch(new GetDataHome());
    }

    ngOnDestroy(): void {
        console.log('Componente Home distrutto');
        this.subscription.unsubscribe();
        this.store.dispatch(new ClearDataHome());
    }

    onMapFullLoaded(): void {
        this.store.dispatch(new SetMapLoaded(true));
    }

    getViewState(): void {
        this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
    }

    getColumnState(): void {
        this.subscription.add(this.columnState$.subscribe(r => this.columnState = r));
    }

    getBoxAttivi(): void {
        this.subscription.add(this.boxAttivi$.subscribe(bA => this.boxAttivi = bA));
    }

}
