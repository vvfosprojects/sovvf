import { Component, Input, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { EnteIntervenuto } from '../../model/ente-intervenuto';
import {Ente} from '../../interface/ente.interface';

@Component({
    selector: 'app-lista-enti',
    templateUrl: './lista-enti.component.html',
    styleUrls: ['./lista-enti.component.css']
})
export class ListaEntiComponent implements OnInit, OnDestroy {

    listaEntiIntervenuti: Ente[];
    listaEntiPresaInCarico: Ente[];

    ngOnInit(): void {
        isDevMode() && console.log('Componente Lista Enti creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Lista Enti distrutto');
    }

}
