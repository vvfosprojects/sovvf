import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Squadra } from '../../model/squadra.model';

@Component({
    selector: 'app-lista-squadre-partenza',
    templateUrl: './lista-squadre-partenza.component.html',
    styleUrls: ['./lista-squadre-partenza.component.css']
})
export class ListaSquadrePartenzaComponent implements OnInit, OnDestroy {

    numeroPartenza: number;
    squadre: Squadra[];

    ngOnInit(): void {
        isDevMode() && console.log('Componente Lista Squadre Partenza creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Lista Squadre Partenza distrutto');
    }

}
