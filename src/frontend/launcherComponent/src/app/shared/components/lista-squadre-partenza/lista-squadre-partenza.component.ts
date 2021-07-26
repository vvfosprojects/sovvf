import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ListaSquadre } from '../../interface/lista-squadre';

@Component({
    selector: 'app-lista-squadre-partenza',
    templateUrl: './lista-squadre-partenza.component.html',
    styleUrls: ['./lista-squadre-partenza.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaSquadrePartenzaComponent implements OnInit, OnDestroy {

    listaSquadre: ListaSquadre;

    ngOnInit(): void {
        console.log('Componente Lista Squadre Partenza creato');
    }

    ngOnDestroy(): void {
        console.log('Componente Lista Squadre Partenza distrutto');
    }

}
