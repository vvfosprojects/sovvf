import { Component, Input, OnInit } from '@angular/core';
import { EnteTelefono } from '../../interface/ente.interface';

@Component({
    selector: 'app-numeri-ente',
    templateUrl: './numeri-ente.component.html',
    styleUrls: ['./numeri-ente.component.css']
})
export class NumeriEnteComponent implements OnInit {

    @Input() telefoni: EnteTelefono[];

    constructor() {
    }

    ngOnInit(): void {
    }

}
