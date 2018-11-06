import { Component, OnInit } from '@angular/core';
import { UnitaOperativaService } from '../../navbar/navbar-service/unita-operativa-service/unita-operativa.service';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    _opened = false;

    constructor(public fakeCambioSede: UnitaOperativaService) {
    }

    ngOnInit() {
    }

    _toggleOpened() {
        this._opened = !this._opened;
    }
}
