import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_TIPOLOGIE, TipologieInterface } from '../../../core/settings/tipologie';
import { Select } from '@ngxs/store';
import { Utente } from '../../../shared/model/utente.model';
import { UtenteState } from '../../navbar/store/states/operatore/utente.state';


@Component({
    selector: 'app-chiamata',
    templateUrl: './chiamata.component.html',
    styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit, OnDestroy {

    tipologie: TipologieInterface[] = APP_TIPOLOGIE;

    @Select(UtenteState.utente) utente$: Observable<Utente>;

    constructor() {
    }

    ngOnInit(): void {
        isDevMode() && console.log('Componente Chiamata creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Chiamata distrutto');
    }

}
