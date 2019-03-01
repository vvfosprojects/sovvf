import { Component, EventEmitter, isDevMode, OnDestroy, OnInit, Output } from '@angular/core';
import { MarkerService } from '../maps/service/marker-service/marker-service.service';
import { CenterService } from '../maps/service/center-service/center-service.service';
import { Observable, Subscription } from 'rxjs';
import { APP_TIPOLOGIE, TipologieInterface } from '../../../core/settings/tipologie';
import { CentroMappa } from '../maps/maps-model/centro-mappa.model';
import { ChiamataMarker } from '../maps/maps-model/chiamata-marker.model';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { Select, Store } from '@ngxs/store';
import { GetIdChiamata } from './store/actions/chiamata.actions';
import { ChiamataState } from './store/states/chiamata.state';
import { SchedaTelefonataInterface } from './model/scheda-telefonata.interface';
import { ReducerSchedaTelefonata } from './store/actions/scheda-telefonata.actions';
import { SchedaTelefonataState } from './store/states/scheda-telefonata.state';
import { Utente } from '../../../shared/model/utente.model';
import { UtenteState } from '../../navbar/operatore/store/states/utente.state';


@Component({
    selector: 'app-chiamata',
    templateUrl: './chiamata.component.html',
    styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit, OnDestroy {

    @Output() chiamataMarker = new EventEmitter<ChiamataMarker>();

    subscription = new Subscription();
    tipologie: TipologieInterface[] = APP_TIPOLOGIE;
    centroMappa: CentroMappa;
    coordinate: Coordinate;

    @Select(ChiamataState.idChiamata) idChiamata$: Observable<string>;
    @Select(SchedaTelefonataState.coordinate) coordinate$: Observable<Coordinate>;
    @Select(SchedaTelefonataState.annullaChiamataMarker) annullaChiamata$: Observable<boolean>;
    @Select(UtenteState.utente) utente$: Observable<Utente>;

    constructor(private store: Store,
                private markerService: MarkerService,
                private centerService: CenterService) {

        this.centroMappa = this.centerService.centroMappaIniziale;
        this.subscription.add(this.coordinate$.subscribe(r => this.coordinate = r));
        this.subscription.add(this.annullaChiamata$.subscribe(r => {
            if (r) {
                this.annullaChiamataMarker();
            }
        }));
        this.subscription.add(
            this.centerService.getCentro().subscribe(r => {
                if (this.coordinate) {
                    const xyChiamata = [Math.floor(this.coordinate.latitudine * 1000) / 1000, Math.floor(this.coordinate.longitudine * 1000) / 1000];
                    const xyCentro = [Math.floor(r.coordinate.latitudine * 1000) / 1000, Math.floor(r.coordinate.longitudine * 1000) / 1000];
                    if (xyChiamata[0] !== xyCentro[0] && xyChiamata[1] !== xyCentro[1]) {
                        this.centroMappa = r;
                    }
                }
            })
        );
    }

    ngOnInit(): void {
        isDevMode() && console.log('Componente Chiamata creato');
        this.store.dispatch(new GetIdChiamata());
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Chiamata distrutto');
        this.subscription.unsubscribe();
    }

    getSchedaTelefonata($event: SchedaTelefonataInterface): void {
        this.store.dispatch(new ReducerSchedaTelefonata($event));
    }

    annullaChiamataMarker() {
        this.markerService.chiamata(null, '', this.centroMappa);
    }

}
