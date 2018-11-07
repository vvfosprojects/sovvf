import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from '../../auth/_services';
import { User } from '../../auth/_models';

@Component({
    selector: 'app-operatore',
    templateUrl: './operatore.component.html',
    styleUrls: ['./operatore.component.css']
})
export class OperatoreComponent implements OnInit {

    user: User[] = [];

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.user = users;
        });
    }

}
