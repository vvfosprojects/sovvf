import { CurrenciesUpdateAction } from '../actions/currency';
import { Currency } from '../models/currency';
import { AmountChangeAction } from '../actions/amount';
import { UserloginSuccess, UserloginAction, UserloginFail } from '../actions/user';
import { Store } from '@ngrx/store';

import * as fromRoot from '../reducers';

import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { Observable } from 'rxjs/Observable';

import { AlertService, AuthenticationService, UserService } from '../login/_services/index';
import { User } from './_models/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
    model: any = {};
    modelr: any =  {};
    loading = false;
    returnUrl: string;
    public amount$: Observable<number>;
    public currencyRates$: Observable<Currency[]>;
    public userSuccess$: Observable<User>;
    public userFail$: Observable<any>;
    
    

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        public store: Store<fromRoot.State>
    ) {
        this.amount$ = store.select(fromRoot.getAmountState);
        this.currencyRates$ = store.select(fromRoot.getCurrnecyRates);
        this.userSuccess$ = store.select(fromRoot.getUserLoginSuccessState);
        this.userFail$ = store.select(fromRoot.getUserLoginFailState);
        
        }

    ngOnInit() {
        this.store.dispatch(new CurrenciesUpdateAction());
        // reset login status
        this.authenticationService.logout();
        
                // get return url from route parameters or default to '/'
                this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                console.log("qui...");
                console.log("loading = "+this.loading);

             
    }

    onAmountChange(amount: string) {
        const number = parseFloat(amount);
        if (!isNaN(number)) this.store.dispatch(new AmountChangeAction(number));
        
        this.userSuccess$.subscribe(
          n => console.log(n),
          e => console.log(e)
        )
      }

    onLoggedin() {
        console.log("pure qui..."+this.model.username+this.model.password);
        this.loading = true;
        console.log("loading = "+this.loading);
        //creazione utente fittizio.
        localStorage.removeItem('users');
        this.modelr.username = "vvf";
        this.modelr.password = "vvf";
        
        //TODO qui verrà fatto il dispatch dell'action con effect. e la chiamata al service
        // sottostante dovrebbe andare nella cartella effects.
        this.userService.create(this.modelr)
        .subscribe(
            data => {
             //   this.alertService.success('Registration successful', true);
             //   this.router.navigate(['/login']);
            },
            error => {
             //   this.alertService.error(error);
                this.loading = false;
            });

          /*  console.log("dispaccio azione");
            this.store.dispatch(new UserLoginAction(this.modelr));
            console.log("utente "+this.user$[1]);
*/
            //TODO qui verrà fatto il dispatch dell'action con effect. e la chiamata al service
            // sottostante dovrebbe andare nella cartella effects.
            this.store.dispatch(new UserloginAction(this.model));
            this.userSuccess$.subscribe(
                n => {
                    if (n != undefined){
                        console.log("utente obs "+JSON.stringify(n));
                        this.router.navigate([this.returnUrl]);
                    }
                   
                },
                e => console.log(e)
              )
            //  console.log("prima di utente fallito.");
              this.userFail$.subscribe(
                 n => {
                     //        console.log("in utente fallito."+n);
           //   this.alertService.error(n.toString);
                    // if(n != undefined){
                          console.log("login fallito obs "+n);
                          this.alertService.error(this.userFail$);
                          this.loading = false;
                      //  this.loginFail(n);
                    //  }
                  e => console.log(e)
                  })
            
      /*
            this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                    console.log("in routing..");
                    this.store.dispatch(new UserloginSuccess(this.model));
                    this.userSuccess$.subscribe(
                        n => console.log("utente "+JSON.stringify(n)),
                        e => console.log(e)
                      )
                    this.router.navigate([this.returnUrl]);
                    console.log("routati");
                },
                error => {
                    console.log("errore autenticazione."+error);
                    this.alertService.error(error);
                    this.loading = false;
                });
          */      

                 
        //localStorage.setItem('isLoggedin', 'true');
    }
}
