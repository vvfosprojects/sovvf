import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-risultati-paginazione',
    templateUrl: './risultati-paginazione.component.html',
    styleUrls: ['./risultati-paginazione.component.css']
})
export class RisultatiPaginazioneComponent implements OnInit {

    @Input() utentiFiltratiLength: number;
    @Input() utentiPaginatiLength: number;
    @Input() pageSize: number;

    constructor() {
    }

    ngOnInit() {
    }

}
