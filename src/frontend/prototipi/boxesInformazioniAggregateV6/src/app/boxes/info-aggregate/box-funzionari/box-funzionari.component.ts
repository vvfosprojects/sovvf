import {Component, OnInit, Input} from '@angular/core';
import {BoxFunzionariSo} from '../../boxes-model/box-funzionari-so.model';


@Component({
    selector: 'app-box-funzionari',
    templateUrl: './box-funzionari.component.html',
    styleUrls: ['./box-funzionari.component.css']
})
export class BoxFunzionariComponent implements OnInit {

    @Input() funzionari: BoxFunzionariSo[];
    private numero: number;

    constructor() {
    }

    ngOnInit() {
        // console.log(this.funzionari)
    }

    public getFunzPresente(): boolean {
        let presenteFunz = false;

        this.funzionari.forEach(c => {
            if (c.funzGuardia) {
                presenteFunz = true;
            }
        });

        return presenteFunz;
    }

    public getCapoTurnoPresente(): boolean {
        let presenteCapoTurno = false;

        this.funzionari.forEach(c => {
            if (c.capoTurno) {
                presenteCapoTurno = true;
            }
        });

        return presenteCapoTurno;
    }
}
