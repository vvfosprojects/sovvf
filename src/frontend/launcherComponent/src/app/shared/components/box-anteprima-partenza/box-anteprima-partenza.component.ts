import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Partenza } from '../../model/partenza.model';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { statoMezzoColor } from '../../helper/function';
import { Mezzo } from '../../model/mezzo.model';
import { Squadra } from '../../model/squadra.model';

@Component({
    selector: 'app-box-anteprima-partenza',
    templateUrl: './box-anteprima-partenza.component.html',
    styleUrls: ['./box-anteprima-partenza.component.css']
})
export class BoxAnteprimaPartenzaComponent implements OnInit {

    @Input() partenza: Partenza;
    @Input() nonModificabile: boolean;
    @Input() inSostituzione: boolean;
    @Input() hideBox: boolean;
    @Input() boxSostitutivo: boolean;
    @Input() nuovoMezzo: Mezzo;
    @Input() nuoveSquadre: Squadra[];

    @Output() listaSquadrePartenza: EventEmitter<any> = new EventEmitter<any>();
    @Output() modificaPartenza: EventEmitter<any> = new EventEmitter<any>();
    @Output() annullaPartenza: EventEmitter<any> = new EventEmitter<any>();


    constructor() {
    }

    ngOnInit(): void {
    }

    onListaSquadrePartenza(event: any): void {
        if (event) {
            event.stopPropagation();
        }
        this.listaSquadrePartenza.emit();
    }

    onModificaPartenza(event: any): void {
        if (event) {
            event.stopPropagation();
        }
        this.modificaPartenza.emit();
    }

    statoMezzoColor(stato: StatoMezzo) {
        return statoMezzoColor(stato);
    }

    onDismissPartenza(event: any): void {
        if (event) {
            event.stopPropagation();
        }
        this.annullaPartenza.emit();
        this.nuoveSquadre = [];
    }
}
