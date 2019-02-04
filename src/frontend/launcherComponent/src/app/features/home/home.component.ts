import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewService } from '../../core/service/view-service/view-service.service';
import { ViewInterface } from '../../shared/interface/view.interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { ChiamataMarker } from './maps/maps-model/chiamata-marker.model';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {

    subscription = new Subscription();
    viewState: ViewInterface;

    richiestaNuovaPartenza: SintesiRichiesta;
    chiamataMarker: ChiamataMarker;

    constructor(private viewService: ViewService) {
        this.viewState = this.viewService.viewState;
        this.subscription.add(
            this.viewService.getView().subscribe((r: ViewInterface) => {
                this.viewState = r;
            })
        );
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

    switchView(event: string, chiamata?: boolean) {
        this.viewService.switchView(event, chiamata);
    }

    _chiamataMarker(chiamata: ChiamataMarker) {
        this.chiamataMarker = chiamata;
    }
}
