import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterbarService } from '../filterbar-service/filterbar-service.service';
import { ViewInterface } from './view.interface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-view-mode',
    templateUrl: './view-mode.component.html',
    styleUrls: ['./view-mode.component.css']
})
export class ViewModeComponent implements OnInit, OnDestroy {

    subscription = new Subscription();
    viewState: ViewInterface;
    colorButton: any;
    disableViewButtons = false;

    constructor(private viewService: FilterbarService) {
        this.colorButton = this.viewService.colorButton;
        this.viewState = this.viewService.viewState;
        this.subscription.add(
            this.viewService.getView().subscribe((r: ViewInterface) => {
                this.viewState = r;
                this._colorButton();
                this.viewService.colorButton = this.colorButton;
                this.disableViewButtons = r.comp_partenza ? true : false;
            })
        );
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    soloRichieste(): void {
        this.viewService.sendView({
            richieste: true,
            mappa: false,
            comp_partenza: false,
            split: false,
            chiamata: false,
        });
    }

    normale(): void {
        this.viewService.sendView({
            richieste: true,
            mappa: true,
            comp_partenza: false,
            split: true,
            chiamata: false,
        });
    }

    soloMappa(): void {
        this.viewService.sendView({
            richieste: false,
            mappa: true,
            comp_partenza: false,
            split: false,
            chiamata: false,
        });
    }

    _colorButton(): void {
        if (this.viewState.split) {
            this.viewState.split ? this.colorButton[1] = 'btn-secondary' : this.colorButton[1] = 'btn-outline-secondary';
            this.colorButton[0] = 'btn-outline-secondary';
            this.colorButton[2] = 'btn-outline-secondary';
        } else {
            this.colorButton[1] = 'btn-outline-secondary';
            this.viewState.richieste ? this.colorButton[0] = 'btn-secondary' : this.colorButton[0] = 'btn-outline-secondary';
            this.viewState.mappa ? this.colorButton[2] = 'btn-secondary' : this.colorButton[2] = 'btn-outline-secondary';
        }
    }

}
