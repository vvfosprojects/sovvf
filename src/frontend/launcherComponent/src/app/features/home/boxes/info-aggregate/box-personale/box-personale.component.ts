import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { BoxPersonale } from '../../boxes-model/box-personale.model';

@Component({
    selector: 'app-box-personale',
    templateUrl: './box-personale.component.html',
    styleUrls: ['./box-personale.component.css']
})
export class BoxPersonaleComponent implements OnChanges {

    @Input() personale: BoxPersonale;
    @Output() clickServizi = new EventEmitter<string>();
    presenze = {} as Presenze;

    ngOnChanges(): void {
        this.getPresenze();
    }

    getPresenze() {
        this.presenze.totFunzionari = 0;
        this.presenze.totTecnici = 0;
        this.personale.funzionari.forEach(result => {
            if (result.funzGuardia || result.capoTurno) {
                this.presenze.totFunzionari++;
            }
            if (result.tecnicoGuardia1 || result.tecnicoGuardia2) {
                this.presenze.totTecnici++;
            }
        });
        this.presenze.capoTurno = this.personale.funzionari.some(key => key.capoTurno);
        this.presenze.funzGuardia = this.personale.funzionari.some(key => key.funzGuardia);
    }

}

interface Presenze {
    totFunzionari: number;
    totTecnici: number;
    funzGuardia: boolean;
    capoTurno: boolean;
}
