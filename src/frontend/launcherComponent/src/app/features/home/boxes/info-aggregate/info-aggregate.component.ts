import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoxInterventi } from '../boxes-model/box-interventi.model';
import { BoxMezzi } from '../boxes-model/box-mezzi.model';
import { BoxClickInterface } from '../box-interface/box-click-interface';
import { Subscription, Observable } from 'rxjs';
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
import { BoxPersonalePresenze, BoxPersonaleQty } from '../../../../shared/interface/box-personale.interface';
import { TurnoState } from '../../../navbar/store/states/turno.state';
import { TurnoCalendario } from '../../../navbar/turno/turno-calendario.model';
import { AuthState } from '../../../auth/store/auth.state';
import {ImpostazioniState} from '../../../../shared/store/states/impostazioni/impostazioni.state';

@Component({
    selector: 'app-info-aggregate',
    templateUrl: './info-aggregate.component.html',
    styleUrls: ['./info-aggregate.component.css']
})
export class InfoAggregateComponent implements OnInit, OnDestroy {

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;
    @Select(BoxRichiesteState.richieste) richieste$: Observable<BoxInterventi>;
    @Select(BoxMezziState.mezzi) mezzi$: Observable<BoxMezzi>;
    @Select(BoxPersonaleState.personaleQty) personaleQty$: Observable<BoxPersonaleQty>;
    @Select(BoxPersonaleState.presenze) presenze$: Observable<BoxPersonalePresenze>;
    @Select(TurnoState.turnoCalendario) turnoCalendario$: Observable<TurnoCalendario>;

    datimeteo: Meteo;

    @Select(BoxClickState.boxClick) boxClick$: Observable<BoxClickInterface>;

    subscription = new Subscription();

    timerMeteo: NodeJS.Timer;

    constructor(private store: Store,
                private modalService: NgbModal,
                private meteoService: MeteoService) {
        this.startMeteo();
        this.getNightMode();
    }

    ngOnInit(): void {
        console.log('Componente Info Aggregate creato');
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        clearInterval(this.timerMeteo);
        console.log('Componente Info Aggregate Distrutto');
    }

    clickBox(cat: string, tipo: string): void {
        this.store.dispatch(new ReducerBoxClick(cat, tipo));
    }

    getNightMode(): void {
      this.subscription.add(
        this.nightMode$.subscribe((nightMode: boolean) => {
          this.nightMode = nightMode;
        })
      );
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

    clickServizi(tipo: string): void {
        if (tipo === 'openModal') {
            // this.modalService.open(ModalServiziComponent, { size: 'lg', centered: true });
        }
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
