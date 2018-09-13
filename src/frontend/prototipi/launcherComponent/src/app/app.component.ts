import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    private _opened = false;
    constructor() {
    }

    ngOnInit() {
    }

    private _toggleOpened() {
        this._opened = !this._opened;
    }
}
