import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ente } from '../../interface/ente.interface';

@Component({
    selector: 'app-lista-enti',
    templateUrl: './lista-enti.component.html',
    styleUrls: ['./lista-enti.component.css']
})
export class ListaEntiComponent implements OnInit, OnDestroy {

    listaEntiIntervenuti: Ente[];
    listaEntiPresaInCarico: Ente[];

    ngOnInit(): void {
        console.log('Componente Lista Enti creato');
    }

    ngOnDestroy(): void {
        console.log('Componente Lista Enti distrutto');
    }

}
