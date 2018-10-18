import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {UnitaOperativaService} from './navbar-service/unita-operativa-service/unita-operativa.service';
import {Sede} from '../shared/model/sede.model';
import {Coordinate} from '../shared/model/coordinate.model';
import {Localita} from '../shared/model/localita.model';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    @Input() user: any;
    @Output() openedSidebar: EventEmitter<any> = new EventEmitter();
    unitaOperative: Sede[];
    unitaAttuale: Sede;
    time: string;
    searchUnita: string;

    constructor(private unitaOperativaS: UnitaOperativaService) {
    }

    ngOnInit() {
        this.nowDate();
        this.getUnitaOperative();
        this.getUnitaAttuale();

        /* Setto il comando a 'Roma' */
        const sedeAttuale = new Sede('1', 'Comando di Roma', new Localita(new Coordinate(41.900170, 12.491000)), 'Comando');
        this.unitaOperativaS.sendUnitaOperativaAttuale(sedeAttuale);
        this.unitaOperativaS.startCount++;
    }

    /* Unità operativa methods */
    getUnitaOperative() {
        this.unitaOperativaS.getUnitaOperative().subscribe(unitaOperative => {
            this.unitaOperative = unitaOperative;
        });
    }

    getUnitaAttuale() {
        this.unitaOperativaS.getUnitaOperativaAttuale().subscribe(unitaAttuale => {
            this.unitaAttuale = unitaAttuale;
        });
    }

    changeUnitaAttuale(newUnita) {
        this.unitaOperativaS.sendUnitaOperativaAttuale(newUnita);
    }

    /* End unità operativa methods */

    nowDate() {
        const moment$ = new Observable<any>((observer) => {
            setInterval(() => observer.next(moment().format('DD/MM/YYYY, HH:MM')));
        });
        moment$.subscribe(res => {
            this.time = res;
        });
    }

    openSidebar() {
        this.openedSidebar.emit();
    }
}
