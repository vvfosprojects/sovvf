import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../../login/_services/index';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/reducers';
import { Userlogout } from '../../../store/actions/user';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass: string = 'push-right';

    constructor(private translate: TranslateService, 
                 public router: Router,
                 private authenticationService: AuthenticationService,
                 public store: Store<fromRoot.State>) {
        translate.setDefaultLang('it'); //Il linguaggio di default è l'italiano.
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {}

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
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

    changeLang(language: string) {
        this.translate.use(language);
    }
}
