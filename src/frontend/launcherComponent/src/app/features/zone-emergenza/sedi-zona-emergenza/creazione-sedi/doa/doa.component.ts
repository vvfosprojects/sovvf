import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Doa } from '../../../interface/doa.interface';

@Component({
    selector: 'app-doa',
    templateUrl: './doa.component.html',
    styleUrls: ['./doa.component.scss']
})
export class DoaComponent implements OnInit {

    @Input() doa: Doa;
    @Input() addPcaButton: boolean;

    @Output() addPca: EventEmitter<Doa> = new EventEmitter<Doa>();

    constructor() {
    }

    ngOnInit(): void {
    }

    onAddPca(doa: Doa): void {
        this.addPca.emit(doa);
    }
}
