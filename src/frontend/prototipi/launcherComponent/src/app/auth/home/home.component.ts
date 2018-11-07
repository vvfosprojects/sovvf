import { Component, OnInit } from '@angular/core';
import { UnitaAttualeService } from '../../navbar/navbar-service/unita-attuale/unita-attuale.service';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    _opened = false;

    constructor(public fakeCambioSede: UnitaAttualeService) {
    }

    ngOnInit() {
    }

    _toggleOpened() {
        this._opened = !this._opened;
    }
}
