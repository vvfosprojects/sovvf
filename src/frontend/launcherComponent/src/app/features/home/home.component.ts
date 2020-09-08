import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Grids, ViewInterfaceButton, ViewInterfaceMaps, ViewLayouts } from '../../shared/interface/view.interface';
import { Select, Store } from '@ngxs/store';
import { ViewComponentState } from './store/states/view/view.state';
import { Composizione } from '../../shared/enum/composizione.enum';
import { ClearDataHome, GetDataHome } from './store/actions/home.actions';
import { NavbarState } from '../navbar/store/states/navbar.state';
import { SetMapLoaded } from '../../shared/store/actions/app/app.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SostituzionePartenzaModalComponent } from '../../shared/modal/sostituzione-partenza-modal/sostituzione-partenza-modal.component';

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

    constructor(private store: Store,
                private modalService: NgbModal) {
        this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
        this.subscription.add(this.columnState$.subscribe(r => this.columnState = r));
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Home creato');
        this.store.dispatch(new GetDataHome());
    }

    ngOnDestroy() {
        isDevMode() && console.log('Componente Home distrutto');
        this.subscription.unsubscribe();
        this.store.dispatch(new ClearDataHome());
    }

    onMapFullLoaded() {
        this.store.dispatch(new SetMapLoaded(true));
    }

    open() {
        this.modalService.open(SostituzionePartenzaModalComponent);
    }

}
