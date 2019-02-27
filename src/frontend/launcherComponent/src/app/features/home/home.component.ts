import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Grids, ViewInterfaceButton, ViewLayouts } from '../../shared/interface/view.interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { Select } from '@ngxs/store';
import { ViewComponentState } from './store/states/view.state';
import { Composizione } from '../../shared/enum/composizione.enum';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {

    subscription = new Subscription();

    viewState: ViewLayouts;
    columnState: Grids;

    richiestaNuovaPartenza: SintesiRichiesta;

    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;
    @Select(ViewComponentState.columnGrid) columnState$: Observable<Grids>;
    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;
    @Select(ViewComponentState.colorButton) colorButton$: Observable<ViewInterfaceButton>;

    constructor() {
        this.subscription.add(this.viewState$.subscribe(r => {
            console.log(r);
            this.viewState = r;
        }));
        this.subscription.add(this.columnState$.subscribe(r => {
            console.log(r);
            this.columnState = r;
        }));
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Home creato');
    }

    ngOnDestroy() {
        isDevMode() && console.log('Componente Home distrutto');
        this.subscription.unsubscribe();
    }

    nuovaPartenza(richiesta: SintesiRichiesta) {
        this.richiestaNuovaPartenza = richiesta;
    }

}
