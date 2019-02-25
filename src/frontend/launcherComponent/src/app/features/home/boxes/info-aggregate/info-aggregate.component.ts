import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoxInterventi } from '../boxes-model/box-interventi.model';
import { BoxMezzi } from '../boxes-model/box-mezzi.model';
import { BoxPersonale } from '../boxes-model/box-personale.model';
import { BoxClickInterface } from '../box-interface/box-click-interface';
import { Subscription, Observable } from 'rxjs';
import { ModalServiziComponent } from './modal-servizi/modal-servizi.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeteoService } from '../../../../shared/meteo/meteo-service.service';
import { Meteo } from '../../../../shared/model/meteo.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { Select, Store } from '@ngxs/store';
import { BoxRichiesteState, BoxMezziState, BoxPersonaleState, BoxClickState, InitBoxFiltri, ReducerBoxClick, FetchBoxRichieste, FetchBoxMezzi, FetchBoxPersonale } from '../store';

@Component({
    selector: 'app-info-aggregate',
    templateUrl: './info-aggregate.component.html',
    styleUrls: ['./info-aggregate.component.css']
})
export class InfoAggregateComponent implements OnInit, OnDestroy {
    @Select(BoxRichiesteState.richieste) richieste$: Observable<BoxInterventi>;
    @Select(BoxMezziState.mezzi) mezzi$: Observable<BoxMezzi>;
    @Select(BoxPersonaleState.personale) personale$: Observable<BoxPersonale>;

    datimeteo: Meteo;

    @Select(BoxClickState.boxClick) boxClick$: Observable<BoxClickInterface>;

    subscription = new Subscription();

    constructor(private store: Store,
        private modalService: NgbModal,
        private meteoService: MeteoService) {

        this.startMeteo();
    }

    ngOnInit() {
        this.store.dispatch(new FetchBoxRichieste());
        this.store.dispatch(new FetchBoxMezzi());
        this.store.dispatch(new FetchBoxPersonale());
        this.store.dispatch(new InitBoxFiltri());
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    clickBox(cat: string, tipo: string): void {
        this.store.dispatch(new ReducerBoxClick(cat, tipo));
    }

    clickServizi(tipo: string) {
        if (tipo === 'openModal') {
            this.modalService.open(ModalServiziComponent, { size: 'lg', centered: true });
        }
    }

    startMeteo() {
        /**
         * Dati coordinate fake in attesa di quelle passate dal servizio località utente
         */
        const coordinate = new Coordinate(41.899940, 12.491270);
        this._getMeteoData(coordinate);
        setInterval(() => {
            this.datimeteo = undefined;
            this._getMeteoData(coordinate);
        }, 300000);
    }

    _getMeteoData(coords: Coordinate) {
        setTimeout(() => {
            this.meteoService.getMeteoData(coords)
                .subscribe(data => {
                    this.datimeteo = data;
                });
        }, 100);
    }
}
