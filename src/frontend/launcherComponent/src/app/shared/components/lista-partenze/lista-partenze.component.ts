import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListaSquadre } from '../../interface/lista-squadre';
import { ListaSquadrePartenzaComponent } from '../..';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Partenza } from '../../model/partenza.model';
import { Mezzo } from '../../model/mezzo.model';

@Component({
    selector: 'app-lista-partenze',
    templateUrl: './lista-partenze.component.html',
    styleUrls: ['./lista-partenze.component.css']
})
export class ListaPartenzeComponent {

    @Input() partenze: Partenza[];
    @Output() mezzoArrivatoSulPosto: EventEmitter<any> = new EventEmitter();

    constructor(private modalService: NgbModal) {
    }

    onListaSquadrePartenza(listaSquadre: ListaSquadre) {
        console.log(listaSquadre);
        const modal = this.modalService.open(ListaSquadrePartenzaComponent, { windowClass: 'squadrePartenza', backdropClass: 'light-blue-backdrop', centered: true });
        modal.componentInstance.listaSquadre = listaSquadre;
        modal.result.then(() => console.log('Lista Squadre Partenza ' + listaSquadre.idPartenza + ' Aperta'),
            () => console.log('Lista Squadre Partenza Chiusa'));
    }

    onMezzoArrivatoSulPosto(mezzo: Mezzo) {
        this.mezzoArrivatoSulPosto.emit(mezzo);
    }
}
