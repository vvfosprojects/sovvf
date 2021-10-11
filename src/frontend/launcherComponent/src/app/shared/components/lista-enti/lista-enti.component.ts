import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { EnteInterface } from '../../interface/ente.interface';

@Component({
    selector: 'app-lista-enti',
    templateUrl: './lista-enti.component.html',
    styleUrls: ['./lista-enti.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaEntiComponent implements OnInit, OnDestroy {

    listaEntiIntervenuti: EnteInterface[];
    listaEntiPresaInCarico: EnteInterface[];

    ngOnInit(): void {
        console.log('Componente Lista Enti creato');
    }

    ngOnDestroy(): void {
        console.log('Componente Lista Enti distrutto');
    }

}
