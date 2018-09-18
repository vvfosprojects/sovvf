import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';

import {User} from '../_models/index';
import {UserService} from '../_services/index';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    users: User[] = [];
    _opened = false;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }

    _toggleOpened() {
        this._opened = !this._opened;
    }
}
