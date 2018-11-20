import {Component, OnInit, Input} from '@angular/core';
import {BoxPersonale} from '../../boxes-model/box-personale.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalServiziComponent } from '../modal-servizi/modal-servizi.component';


@Component({
    selector: 'app-box-personale',
    templateUrl: './box-personale.component.html',
    styleUrls: ['./box-personale.component.css']
})
export class BoxPersonaleComponent implements OnInit {

    @Input() personale: BoxPersonale;

    private colorStato: [string, string][];
    private mapColorStato: Map<string, string>;

    constructor(private modalService: NgbModal) {
        this.color();
    }

    ngOnInit() {
    }

    private color() {
        this.colorStato = [
            ['bassa', 'badge-danger'],
            ['media', 'badge-warning'],
            ['alta', 'badge-success']
        ];
        this.mapColorStato = new Map(this.colorStato);
    }

    getTotalFunz(): Result {
        let count = 0;
        this.personale.funzionari.forEach(c => {
            if (c.funzGuardia || c.capoTurno) {
                count++;
            }
        });
        let funz = '';
        if (count > 1) {
            funz = 'Funzionari';
        } else {
            funz = 'Funzionario';
        }
        return {
            nome: funz,
            numero: count
        };
    }

    getTotalTecn(): Result {
        let count = 0;
        this.personale.funzionari.forEach(c => {
            if (c.tecnicoGuardia1 || c.tecnicoGuardia2) {
                count++;
            }
        });
        let tecn;
        if (count > 1) {
            tecn = 'Tecnici';
        } else {
            tecn = 'Tecnico';
        }

        return {
            nome: tecn,
            numero: count
        };
    }

    squadreAssegnate(): string {
        const rapporto = (this.personale.squadreAssegnate / this.personale.squadreServizio) * 100;
        let prop = '';
        switch (true) {
            case (rapporto < 50):
                prop = 'bassa';
                break;
            case (rapporto < 80):
                prop = 'media';
                break;
            default:
                prop = 'alta';
                break;
        }
        return this.mapColorStato.get(prop);
    }

    getFunzPresente(): boolean {
        let presenteFunz = false;

        this.personale.funzionari.forEach(c => {
            if (c.funzGuardia) {
                presenteFunz = true;
            }
        });

        return presenteFunz;
    }

    getCapoTurnoPresente(): boolean {
        let presenteCapoTurno = false;

        this.personale.funzionari.forEach(c => {
            if (c.capoTurno) {
                presenteCapoTurno = true;
            }
        });

        return presenteCapoTurno;
    }

    getTecnicoGuardia(): number {
        let presenteTecnicoGuardia = 0;

        this.personale.funzionari.forEach(c => {
            if (c.tecnicoGuardia1 || c.tecnicoGuardia2) {
                presenteTecnicoGuardia++;
            }
        });

        return presenteTecnicoGuardia;
    }

    openModalServizi() {
        this.modalService.open(ModalServiziComponent, {size: 'lg', centered: true});
    }
}

interface Result {
    nome: string;
    numero: number;
}
