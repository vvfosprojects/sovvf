import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DettaglioPartenza } from '../../model/partenza.model';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { statoMezzoColor } from '../../helper/function-mezzo';
import { Mezzo } from '../../model/mezzo.model';
import { Squadra } from '../../model/squadra.model';
import { iconaStatiClass, nomeStatiSquadra } from '../../helper/function-composizione';

@Component({
    selector: 'app-box-anteprima-partenza',
    templateUrl: './box-anteprima-partenza.component.html',
    styleUrls: ['./box-anteprima-partenza.component.css']
})
export class BoxAnteprimaPartenzaComponent {

    @Input() partenza: DettaglioPartenza;
    @Input() title: string;
    @Input() testoModifica: string;
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

    onListaSquadrePartenza(event: any): void {
        if (event) {
            event.stopPropagation();
        }
        this.listaSquadrePartenza.emit();
    }

    statoMezzoColor(stato: StatoMezzo): string {
        return statoMezzoColor(stato);
    }

    _iconaStatiClass(statoMezzo: any): string {
        return iconaStatiClass(statoMezzo);
    }

    _nomeStatiSquadra(statoSquadra: number): string {
        return nomeStatiSquadra(statoSquadra);
    }
}
