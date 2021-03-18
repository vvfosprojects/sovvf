import { Component, Input } from '@angular/core';
import { EnteTelefono } from '../../interface/ente.interface';

@Component({
    selector: 'app-numeri-ente',
    templateUrl: './numeri-ente.component.html',
    styleUrls: ['./numeri-ente.component.css']
})
export class NumeriEnteComponent {

    @Input() telefoni: EnteTelefono[];

    constructor() {
    }

}
