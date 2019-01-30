import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoxInterventi } from '../boxes-model/box-interventi.model';
import { BoxMezzi } from '../boxes-model/box-mezzi.model';
import { BoxPersonale } from '../boxes-model/box-personale.model';
import { BoxClickService } from './box-service/box-click.service';
import { BoxClickInterface } from './box-service/box-click-interface';
import { Subscription, Observable } from 'rxjs';
import { ModalServiziComponent } from './modal-servizi/modal-servizi.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeteoService } from '../../../../shared/meteo/meteo-service.service';
import { Meteo } from '../../../../shared/model/meteo.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { Select, Store } from '@ngxs/store';
import { BoxesState, FetchBoxPersonale, FetchBoxMezzi, FetchBoxInterventi } from '../store';

@Component({
    selector: 'app-info-aggregate',
    templateUrl: './info-aggregate.component.html',
    styleUrls: ['./info-aggregate.component.css']
})
export class InfoAggregateComponent implements OnInit, OnDestroy {
    @Select(BoxesState.interventi) interventi$: Observable<BoxInterventi>;
    @Select(BoxesState.mezzi) mezzi$: Observable<BoxMezzi>;
    @Select(BoxesState.personale) personale$: Observable<BoxPersonale>;

    datimeteo: Meteo;

    boxClick: BoxClickInterface;
    subscription = new Subscription();

    constructor(private store: Store,
        private boxClickService: BoxClickService,
        private modalService: NgbModal,
        private meteoService: MeteoService) {
        this.boxClick = this.boxClickService.boxClickState;
        this.subscription.add(this.boxClickService.getBoxClick().subscribe((boxClick: BoxClickInterface) => {
            this.boxClick = boxClick;
        }
        ));
        this.startMeteo();
    }

    ngOnInit() {
        this.store.dispatch(new FetchBoxInterventi());
        this.store.dispatch(new FetchBoxMezzi());
        this.store.dispatch(new FetchBoxPersonale());
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    clickBox(cat: string, tipo: string): void {
        if (tipo !== 'tutti') {
            this.boxClick[cat][tipo] = !this.boxClick[cat][tipo];
        } else {
            Object.keys(this.boxClick[cat]).map(r => {
                this.boxClick[cat][r] = false;
            });
        }
        this.boxClickService.sendBoxClick(this.boxClick);
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
        this.getMeteoData(coordinate);
        setInterval(() => {
            this.datimeteo = undefined;
            this.getMeteoData(coordinate);
        }, 300000);
    }

    getMeteoData(coords: Coordinate) {
        setTimeout(() => {
            this.meteoService.getMeteoData(coords)
                .subscribe(data => {
                    this.datimeteo = data;
                });
        }, 100);
    }
}
