import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {UnitaOperativaService} from './navbar-service/unita-operativa-service/unita-operativa.service';
import {Sede} from '../shared/model/sede.model';
import {Coordinate} from '../shared/model/coordinate.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CambioSedeModalNavComponent} from './cambio-sede-modal-nav/cambio-sede-modal-nav.component';


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
    searchUnita: string;

    constructor(private _modalService: NgbModal, private unitaOperativaS: UnitaOperativaService) {
    }

    ngOnInit() {
        this.getUnitaOperative();
        this.getUnitaAttuale();

        /* Setto il comando a 'Roma' */
        const sedeAttuale = new Sede('1', 'Comando di Roma', new Coordinate(41.900170, 12.491000), 'Via Genova, 1, 00184 Roma RM', 'Comando');
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
