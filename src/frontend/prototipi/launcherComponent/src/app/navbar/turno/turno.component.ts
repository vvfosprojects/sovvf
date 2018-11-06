import { Component, OnDestroy, OnInit } from '@angular/core';
import { TurnoService } from '../navbar-service/turno-service/turno.service';
import { Turno } from './turno.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-turno',
    templateUrl: './turno.component.html',
    styleUrls: ['./turno.component.css']
})
export class TurnoComponent implements OnInit, OnDestroy {

    constructor(private turnoService: TurnoService) {
        /**
         *  mi iscrivo al map manager che mi ritorna il centro della mappa
         */
        this.subscription.add(this.turnoService.getTurni().subscribe((data: Turno) => {
            this.precedente = data.turni[0];
            this.corrente = data.turni[1];
            this.successivo = data.turni[2];
        }));

    }

    precedente: string;
    corrente: string;
    successivo: string;
    subscription = new Subscription();

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
