import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnitaAttualeService } from '../../navbar/navbar-service/unita-attuale/unita-attuale.service';
import { Subscription } from 'rxjs';
import { FilterbarService } from '../../filterbar/filterbar-service/filterbar-service.service';
import { ViewInterface } from '../../filterbar/view-mode/view.interface';
import { PartenzaService } from 'src/app/composizione-partenza/service/partenza/partenza.service';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {

    _opened = false;
    subscription = new Subscription();
    viewState: ViewInterface;

    richiestaNuovaPartenza: SintesiRichiesta;

    constructor(public fakeCambioSede: UnitaAttualeService,
        private viewService: FilterbarService,
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
                this.richiestaNuovaPartenza = richiesta
            })
        );
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    _toggleOpened() {
        this._opened = !this._opened;
    }

}
