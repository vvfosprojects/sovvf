import {Component, Input, OnInit} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Utente} from '../../../shared/model/utente.model';
import {UnitaAttualeService} from '../../navbar/navbar-service/unita-attuale/unita-attuale.service';
import {Sede} from '../../../shared/model/sede.model';
import {Observable, Subscription} from 'rxjs';
import {Select} from '@ngxs/store';
import {UtentiState} from '../../home/store/states/utenti/utenti.state';


@Component({
    selector: 'app-tabella-utenti',
    templateUrl: './tabella-utenti.component.html',
    providers: [DecimalPipe]
})
export class TabellaUtentiComponent {
    @Input() ricercaUtenti: any;

    @Select(UtentiState.utenti) utenti$: Observable<Utente[]>;
    utenti: Utente[];

    page = 1;
    pageSize = 10;
    collectionSize: number;

    get utentiPaginati(): Utente[] {
        return this.utenti
            .map((utente, i) => ({id: i + 1, ...utente}))
            .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }

    constructor() {
        this.utenti$.subscribe((utenti: Utente[]) => {
            this.utenti = utenti;
            this.collectionSize = this.utenti.length;
        });
    }
}
