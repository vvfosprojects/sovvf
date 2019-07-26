import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListaSquadre } from '../../interface/lista-squadre';
import { ListaSquadrePartenzaComponent } from '../..';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Partenza } from '../../model/partenza.model';
import { Mezzo } from '../../model/mezzo.model';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
import { StatoMezzoActions } from '../../enum/stato-mezzo-actions.enum';

@Component({
    selector: 'app-lista-partenze',
    templateUrl: './lista-partenze.component.html',
    styleUrls: ['./lista-partenze.component.css']
})
export class ListaPartenzeComponent {

    @Input() partenze: Partenza[];
    @Input() statoRichiesta: StatoRichiesta;
    @Input() inGestione: boolean;

    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter();

    constructor(private modalService: NgbModal) {
    }

    onListaSquadrePartenza(listaSquadre: ListaSquadre) {
        console.log(listaSquadre);
        const modal = this.modalService.open(ListaSquadrePartenzaComponent, { windowClass: 'squadrePartenza', backdropClass: 'light-blue-backdrop', centered: true });
        modal.componentInstance.listaSquadre = listaSquadre;
        modal.result.then(() => console.log('Lista Squadre Partenza ' + listaSquadre.idPartenza + ' Aperta'),
            () => console.log('Lista Squadre Partenza Chiusa'));
    }

    onActionMezzo(mezzoAction: MezzoActionInterface) {
        /* if (this.partenze && this.partenze.length > 0) {
            let mezziSulPostoCount = 0;
            let mezziInViaggioCount = 0;
            this.partenze.forEach((p: Partenza) => {
                if (p.mezzo.stato === StatoMezzo.SulPosto && p.mezzo.codice !== mezzoAction.mezzo.codice) {
                    mezziSulPostoCount += 1;
                } else if (p.mezzo.stato === StatoMezzo.InViaggio && p.mezzo.codice !== mezzoAction.mezzo.codice) {
                    mezziInViaggioCount += 1;
                }
            });

            switch (mezzoAction.action) {
                case StatoMezzoActions.InRientro:
                    if (mezziSulPostoCount === 0 && mezziInViaggioCount === 0) {
                        console.log('La richiesta diventa Chiusa');
                    } else if (mezziSulPostoCount === 0 && mezziInViaggioCount > 0) {
                        console.log('La richiesta diventa Assegnata');
                    } else {
                        this.actionMezzo.emit(mezzoAction);
                    }
                    break;

                default:
                    this.actionMezzo.emit(mezzoAction);
                    break;
            }
        } */
        this.actionMezzo.emit(mezzoAction);
    }
}
