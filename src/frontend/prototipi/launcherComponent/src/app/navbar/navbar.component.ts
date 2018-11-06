import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {UnitaOperativaService} from './navbar-service/unita-operativa-service/unita-operativa.service';
import {Sede} from '../shared/model/sede.model';
import {Coordinate} from '../shared/model/coordinate.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CambioSedeModalNavComponent} from './cambio-sede-modal-nav/cambio-sede-modal-nav.component';
import { first } from 'rxjs/operators';
import { UserService } from '../auth/_services';
import { User } from '../auth/_models';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    /**
     * users è provvisorio, al suo posto ci sarà operatore che porterà con se anche unità attuale di partenza (o di default)
     */
    users: User[] = [];
    @Output() openedSidebar: EventEmitter<any> = new EventEmitter();
    unitaOperative: Sede[];
    unitaAttuale: Sede;
    searchUnita: string;

    constructor(private userService: UserService, private _modalService: NgbModal, private unitaOperativaS: UnitaOperativaService) {
    }

    ngOnInit() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
        this.getUnitaOperative();
        this.getUnitaAttuale();

        /* Setto il comando a 'Roma' */
        const sedeAttuale = new Sede('1', 'Comando di Roma', new Coordinate(41.900170, 12.491000), 'Via Genova, 1, 00184 Roma RM', 'Comando', 'Lazio', 'Roma');
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
        this.openModal(newUnita);
    }

    openSidebar() {
        this.openedSidebar.emit();
    }

    openModal(newUnita) {
        this.unitaOperativaS.unitaS = newUnita;
        this._modalService.open(CambioSedeModalNavComponent);
    }
}
