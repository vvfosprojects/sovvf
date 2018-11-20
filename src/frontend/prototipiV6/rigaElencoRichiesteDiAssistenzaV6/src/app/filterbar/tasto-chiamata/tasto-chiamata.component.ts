import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterbarService } from '../filterbar-service/filterbar-service.service';
import { ViewInterface } from '../view-mode/view.interface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-tasto-chiamata',
    templateUrl: './tasto-chiamata.component.html',
    styleUrls: ['./tasto-chiamata.component.css']
})
export class TastoChiamataComponent implements OnInit, OnDestroy {

    subscription = new Subscription();
    viewState: ViewInterface;
    colorButton = 'btn-outline-success';

    constructor(private viewService: FilterbarService) {
        this.viewState = viewService.viewState;
        this.subscription.add(
            this.viewService.getView().subscribe((r: ViewInterface) => {
                this.viewState = r;
                this._colorButton();
            })
        );
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    chiamata(): void {
        this.viewService.sendView({
            richieste: false,
            mappa: true,
            split: true,
            chiamata: true,
        });
    }

    _colorButton(): void {
        this.viewState.chiamata ? this.colorButton = 'btn-success' : this.colorButton = 'btn-outline-success';
    }

}
