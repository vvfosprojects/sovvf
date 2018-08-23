import {Component, OnInit, Input} from '@angular/core';
import {Componente} from '../model/componente.model';

@Component({
    selector: 'app-componente',
    templateUrl: './componente.component.html',
    styleUrls: ['./componente.component.scss']
})
export class ComponenteComponent implements OnInit {
    @Input() componente: Componente;

    constructor() {
    }

    ngOnInit() {
    }

}