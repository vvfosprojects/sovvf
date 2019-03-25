import { Component, EventEmitter, isDevMode, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { APP_TIPOLOGIE, TipologieInterface } from '../../../core/settings/tipologie';
import { ChiamataMarker } from '../maps/maps-model/chiamata-marker.model';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { Select, Store } from '@ngxs/store';
import { SchedaTelefonataInterface } from './model/scheda-telefonata.interface';
import { ReducerSchedaTelefonata } from '../store/actions/chiamata/scheda-telefonata.actions';
import { Utente } from '../../../shared/model/utente.model';
import { UtenteState } from '../../navbar/store/states/operatore/utente.state';


@Component({
    selector: 'app-chiamata',
    templateUrl: './chiamata.component.html',
    styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit, OnDestroy {

    @Output() chiamataMarker = new EventEmitter<ChiamataMarker>();

    subscription = new Subscription();
    tipologie: TipologieInterface[] = APP_TIPOLOGIE;
    coordinate: Coordinate;

    @Select(UtenteState.utente) utente$: Observable<Utente>;

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        isDevMode() && console.log('Componente Chiamata creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Chiamata distrutto');
        this.subscription.unsubscribe();
    }

    getSchedaTelefonata($event: SchedaTelefonataInterface): void {
        this.store.dispatch(new ReducerSchedaTelefonata($event));
    }

}
