import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';

@Component({ templateUrl: './not-found.component.html' })
export class NotFoundComponent implements OnInit, OnDestroy {

    delayTime = 5000;
    tick = 5;

    subscription: Subscription;


    constructor(private router: Router) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.router.navigate(['home']);
        }, this.delayTime);
        const source = timer(1000, 1000);
        this.delayTime = this.delayTime / 1000 - 1;
        this.subscription = source.subscribe(val => this.tick = (this.delayTime - val));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
