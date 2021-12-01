import { Component, Input, OnInit } from '@angular/core';
import { Pca } from '../../interface/pca.interface';

@Component({
    selector: 'app-pca',
    templateUrl: './pca.component.html',
    styleUrls: ['./pca.component.scss']
})
export class PcaComponent implements OnInit {

    @Input() pca: Pca;

    constructor() {
    }

    ngOnInit(): void {
    }
}
