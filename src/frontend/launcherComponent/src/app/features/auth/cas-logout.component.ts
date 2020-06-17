import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ClearCurrentUser } from './store/auth.actions';
import { Subscription, timer } from 'rxjs';

@Component({
    selector: 'app-cas-logout',
    template: `
        <div class="container-fluid bg-dark" style="height:100vh">
            <div class="row">
                <div class="col-3 mx-auto my-5 px-3 bg-white rounded">
                    <div class="w-75 mx-auto text-center my-3">
                        <img class="img-fluid" src="assets/img/wallpaper_originale.png">
                    </div>
                    <div class="row justify-content-center">
                        <div class="text-center">
                            <h1 class="display-1 font-weight-bold" style="color: #C50030">Logout</h1>
                            <h4 class="font-300" style="color: #DE002F">Sei disconnesso dal Cas</h4>
                            <div>Potrai effettuare nuovamente la login tra {{tick}} secondi.</div>
                            <button (click)="onNext()" class="btn btn-lg btn-primary btn-rounded my-3">Non voglio
                                attendere
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class CasLogoutComponent implements OnInit, OnDestroy {

    tick = 5;
    private delayTime = 5000;
    private subscription: Subscription;

    constructor(private store: Store) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.onNext();
        }, this.delayTime);
        const source = timer(1000, 1000);
        this.delayTime = this.delayTime / 1000 - 1;
        this.subscription.add(source.subscribe(val => this.tick = (this.delayTime - val)));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onNext(): void {
        this.store.dispatch([ new ClearCurrentUser() ]);
    }

}
