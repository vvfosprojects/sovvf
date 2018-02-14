import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-blank-page-dett',
    templateUrl: './blank-page-dett.component.html',
    styleUrls: ['./blank-page-dett.component.scss'],
    animations: [routerTransition()]
})
export class BlankPageComponentDett implements OnInit {
    constructor() {}

    ngOnInit() {}
}
