import {Component, OnInit, Input} from '@angular/core';
import {BoxFunzionariSo} from '../../boxes-model/box-funzionari-so.model';


@Component({
    selector: 'app-box-funzionari',
    templateUrl: './box-funzionari.component.html',
    styleUrls: ['./box-funzionari.component.css']
})
export class BoxFunzionariComponent implements OnInit {

    @Input() funzionari: BoxFunzionariSo[];

    constructor() {
    }

    ngOnInit() {
    }

    getTotalFunz(): number {
        let count = 0;
        this.funzionari.forEach(c => {
            if (c.funzGuardia || c.capoTurno || c.tecnicoGuardia1 || c.tecnicoGuardia2) {
                count++;
            }
        });
        return count;
    }

    getFunzPresente(): boolean {
        let presenteFunz = false;

        this.funzionari.forEach(c => {
            if (c.funzGuardia) {
                presenteFunz = true;
            }
        });

        return presenteFunz;
    }

    getCapoTurnoPresente(): boolean {
        let presenteCapoTurno = false;

        this.funzionari.forEach(c => {
            if (c.capoTurno) {
                presenteCapoTurno = true;
            }
        });

        return presenteCapoTurno;
    }

    getTecnicoGuardia(): number {
        let presenteTecnicoGuardia = 0;

        this.funzionari.forEach(c => {
            if (c.tecnicoGuardia1 || c.tecnicoGuardia2) {
                presenteTecnicoGuardia++;
            }
        });

        return presenteTecnicoGuardia;
    }

    // getTecniciGuardiaArray(): object {
    //     const funzTecnGuardia = [];
    //
    //     this.funzionari.forEach(c => {
    //         if (c.tecnicoGuardia1 && c.tecnicoGuardia2) {
    //             funzTecnGuardia.push(c.tecnicoGuardia1, c.tecnicoGuardia2);
    //         } else if (c.tecnicoGuardia1) {
    //             funzTecnGuardia.push(c.tecnicoGuardia1);
    //         } else {
    //             funzTecnGuardia.push(c.tecnicoGuardia2);
    //         }
    //     });
    //
    //     return funzTecnGuardia;
    // }
}
