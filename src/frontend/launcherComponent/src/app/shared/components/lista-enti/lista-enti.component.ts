import { Component, Input, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { EnteIntervenuto } from '../../model/ente-intervenuto';

@Component({
    selector: 'app-lista-enti',
    templateUrl: './lista-enti.component.html',
    styleUrls: ['./lista-enti.component.css']
})
export class ListaEntiComponent implements OnInit, OnDestroy {

    listaEntiIntervenuti: EnteIntervenuto[];
    listaEntiPresaInCarico: EnteIntervenuto[];

    ngOnInit(): void {
        isDevMode() && console.log('Componente Lista Enti creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Lista Enti distrutto');
    }

}
