import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../login/_services/index';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import { Userlogout } from '../../../store/actions/user';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    isActive: boolean = false;
    showMenu: string = '';

    constructor(private authenticationService: AuthenticationService,
                 public store: Store<fromRoot.State>){
        
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
        this.eventCalled();
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
         // TODO spostare le 2 righe di codice seguenti nell'azione di logout
        // menu sidebar di Uscita.
        this.authenticationService.logout();
        this.store.dispatch(new Userlogout(undefined));
        console.log("messaggio di logout inviato.");
        //
    }

}
