import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ListaSquadre } from '../../interface/lista-squadre';

@Component({
    selector: 'app-lista-squadre-partenza',
    templateUrl: './lista-squadre-partenza.component.html',
    styleUrls: ['./lista-squadre-partenza.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaSquadrePartenzaComponent implements OnInit, OnDestroy {

    codiceMezzo: string;
    listaSquadre: ListaSquadre;

    constructor(private modal: NgbActiveModal) {
    }

    ngOnInit(): void {
        console.log('Componente Lista Squadre Partenza creato');
    }

    ngOnDestroy(): void {
        console.log('Componente Lista Squadre Partenza distrutto');
    }

    close(type: string): void {
        this.modal.close(type);
    }

}
