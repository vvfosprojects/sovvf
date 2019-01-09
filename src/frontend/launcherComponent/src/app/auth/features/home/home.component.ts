import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewService } from '../../../filterbar/view-service/view-service.service';
import { ViewInterface } from '../../../filterbar/view-mode/view.interface';
import { PartenzaService } from 'src/app/composizione-partenza/service/partenza/partenza.service';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {

    subscription = new Subscription();
    viewState: ViewInterface;

    richiestaNuovaPartenza: SintesiRichiesta;

    constructor(private viewService: ViewService,
                private partenzaService: PartenzaService) {
        this.viewState = this.viewService.viewState;
        this.subscription.add(
            this.viewService.getView().subscribe((r: ViewInterface) => {
                this.viewState = r;
            })
        );
        this.subscription.add(
            this.partenzaService.getRichiestaPartenza().subscribe(richiesta => {
                this.richiestaNuovaPartenza = richiesta;
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

    switchCompPartenza(newMode: string) {
        /**
         * da finire
         */
        this.viewService.viewState.layout.composizione.modalita = newMode;
        this.partenzaService.changeCompPartenzaMode(newMode);
    }

    switchView(event: string, chiamata?: boolean) {
        this.viewService.switchView(event, chiamata);
    }

    statoPartenza(event) {
        event ? this.switchView('comp_partenza') : this.switchView('normale');
    }

}
