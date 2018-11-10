import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnitaAttualeService } from '../../navbar/navbar-service/unita-attuale/unita-attuale.service';
import { Subscription } from 'rxjs';
import { FilterbarService } from '../../filterbar/filterbar-service/filterbar-service.service';
import { ViewInterface } from '../../filterbar/view-mode/view.interface';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit, OnDestroy {

    _opened = false;
    subscription = new Subscription();
    viewState: ViewInterface;

    constructor(public fakeCambioSede: UnitaAttualeService, private viewService: FilterbarService) {
        this.viewState = viewService.viewState;
        this.subscription.add(
            this.viewService.getView().subscribe((r: ViewInterface) => {
                this.viewState = r;
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
