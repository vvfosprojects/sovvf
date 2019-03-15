import { Component, OnDestroy } from '@angular/core';
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
import { BoxClickState } from '../../store/states/boxes/box-click.state';
import { BoxRichiesteState } from '../../store/states/boxes/box-richieste.state';
import { BoxMezziState } from '../../store/states/boxes/box-mezzi.state';
import { BoxPersonaleState } from '../../store/states/boxes/box-personale.state';
import { ReducerBoxClick } from '../../store/actions/boxes/box-click.actions';

@Component({
    selector: 'app-info-aggregate',
    templateUrl: './info-aggregate.component.html',
    styleUrls: ['./info-aggregate.component.css']
})
export class InfoAggregateComponent implements OnDestroy {
    @Select(BoxRichiesteState.richieste) richieste$: Observable<BoxInterventi>;
    richieste: BoxInterventi;
    @Select(BoxMezziState.mezzi) mezzi$: Observable<BoxMezzi>;
    mezzi: BoxMezzi;
    @Select(BoxPersonaleState.personale) personale$: Observable<BoxPersonale>;
    personale: BoxPersonale;

    datimeteo: Meteo;

    @Select(BoxClickState.boxClick) boxClick$: Observable<BoxClickInterface>;

    subscription = new Subscription();

    constructor(private store: Store,
                private modalService: NgbModal,
                private meteoService: MeteoService) {
        this.startMeteo();
        this.subscription.add(this.richieste$.subscribe( r => this.richieste = r));
        this.subscription.add(this.mezzi$.subscribe( r => this.mezzi = r));
        this.subscription.add(this.personale$.subscribe( r => this.personale = r));
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
