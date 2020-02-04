import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { Utente } from '../../../shared/model/utente.model';
import { UtenteState } from '../../navbar/store/states/operatore/utente.state';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { HomeState } from '../store/states/home.state';


@Component({
    selector: 'app-chiamata',
    templateUrl: './chiamata.component.html',
    styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit, OnDestroy {

    @Select(UtenteState.utente) utente$: Observable<Utente>;
    @Select(HomeState.tipologie) tipologie$: Observable<Tipologia[]>;

    constructor() {
    }

    ngOnInit(): void {
        isDevMode() && console.log('Componente Chiamata creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Chiamata distrutto');
    }

}
