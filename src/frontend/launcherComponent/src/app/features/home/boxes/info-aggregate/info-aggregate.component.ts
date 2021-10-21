import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BoxInterventi } from '../boxes-model/box-interventi.model';
import { BoxMezzi } from '../boxes-model/box-mezzi.model';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeteoService } from '../../../../shared/meteo/meteo-service.service';
import { Meteo } from '../../../../shared/model/meteo.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { Select, Store } from '@ngxs/store';
import { BoxRichiesteState } from '../../store/states/boxes/box-richieste.state';
import { BoxMezziState } from '../../store/states/boxes/box-mezzi.state';
import { BoxPersonaleState } from '../../store/states/boxes/box-personale.state';
import { BoxPersonalePresenze, BoxPersonaleQty } from '../../../../shared/interface/box-personale.interface';
import { TurnoState } from '../../../navbar/store/states/turno.state';
import { TurnoCalendario } from '../../../navbar/turno/model/turno-calendario.model';
import { AuthState } from '../../../auth/store/auth.state';

@Component({
    selector: 'app-info-aggregate',
    templateUrl: './info-aggregate.component.html',
    styleUrls: ['./info-aggregate.component.css']
})
export class InfoAggregateComponent implements OnInit, OnDestroy {

    @Select(BoxRichiesteState.richieste) richieste$: Observable<BoxInterventi>;
    @Select(BoxMezziState.mezzi) mezzi$: Observable<BoxMezzi>;
    @Select(TurnoState.turnoCalendario) turnoCalendario$: Observable<TurnoCalendario>;
    @Select(BoxPersonaleState.presenzePrevious) presenzePrevious$: Observable<BoxPersonalePresenze>;
    @Select(BoxPersonaleState.personaleQtyPrevious) personaleQtyPrevious$: Observable<BoxPersonaleQty>;
    @Select(BoxPersonaleState.presenzeCurrent) presenzeCurrent$: Observable<BoxPersonalePresenze>;
    @Select(BoxPersonaleState.personaleQtyCurrent) personaleQtyCurrent$: Observable<BoxPersonaleQty>;
    @Select(BoxPersonaleState.presenzeNext) presenzeNext$: Observable<BoxPersonalePresenze>;
    @Select(BoxPersonaleState.personaleQtyNext) personaleQtyNext$: Observable<BoxPersonaleQty>;

    datimeteo: Meteo;

    @Input() nightMode: boolean;

    timerMeteo: NodeJS.Timer;

    constructor(private store: Store,
                private modalService: NgbModal,
                private meteoService: MeteoService) {
        this.startMeteo();
    }

    ngOnInit(): void {
        console.log('Componente Info Aggregate creato');
    }

    ngOnDestroy(): void {
        clearInterval(this.timerMeteo);
        console.log('Componente Info Aggregate Distrutto');
    }

    nightModeBox(): string {
      let value = '';
      if (!this.nightMode) {
        value = 'card app-shadow';
      } else if (this.nightMode) {
        value = 'moon-text moon-card-light';
      }
      return value;
    }

    startMeteo(): void {
        const coordinateUtente = this.store.selectSnapshot(AuthState.currentUser).sede.coordinate;
        const coordinate = new Coordinate(coordinateUtente.latitudine, coordinateUtente.longitudine);
        this._getMeteoData(coordinate);
        this.timerMeteo = setInterval(() => {
            this.datimeteo = undefined;
            this._getMeteoData(coordinate);
        }, 300000);
    }

    _getMeteoData(coords: Coordinate): void {
        setTimeout(() => {
            this.meteoService.getMeteoData(coords)
                .subscribe(data => {
                    this.datimeteo = data;
                });
        }, 100);
    }
}
