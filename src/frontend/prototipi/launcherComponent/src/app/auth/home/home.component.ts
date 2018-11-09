import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnitaAttualeService } from '../../navbar/navbar-service/unita-attuale/unita-attuale.service';
import { Subscription } from 'rxjs';
import { FilterbarService } from '../../filterbar/filterbar-service/filterbar-service.service';
import { ViewInterface } from '../../filterbar/view-mode/view.interface';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit, OnDestroy {

    _opened = false;
    subscription = new Subscription();
    viewState: ViewInterface = {
        richieste: true,
        mappa: true,
        split: true,
        chiamata: false,
    };
    column = ['col-6', 'col-6'];

    constructor(public fakeCambioSede: UnitaAttualeService, private viewService: FilterbarService) {
        this.subscription.add(
            this.viewService.getView().subscribe((r: ViewInterface) => {
                this.viewState = r;
                console.log(r);
                this._column();
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

    _column(): void {
        if (this.viewState.split) {
            this.column = ['col-6', 'col-6'];
        } else {
            if (!this.viewState.mappa) {
                this.column = ['col-12', ''];
            } else {
                this.column = ['', 'col-12'];
            }
        }
    }


}
