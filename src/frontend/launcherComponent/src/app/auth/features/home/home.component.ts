import { Component, OnDestroy, OnInit } from '@angular/core';
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
            // Restituisce la Richiesta
            this.partenzaService.getRichiestaPartenza().subscribe(richiesta => {
                this.richiestaNuovaPartenza = richiesta;
            })
        );
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
