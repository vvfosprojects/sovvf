import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { ListaSquadre } from '../../interface/lista-squadre';

@Component({
    selector: 'app-lista-squadre-partenza',
    templateUrl: './lista-squadre-partenza.component.html',
    styleUrls: ['./lista-squadre-partenza.component.css']
})
export class ListaSquadrePartenzaComponent implements OnInit, OnDestroy {

    listaSquadre: ListaSquadre;

    ngOnInit(): void {
        isDevMode() && console.log('Componente Lista Squadre Partenza creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Lista Squadre Partenza distrutto');
    }

}
