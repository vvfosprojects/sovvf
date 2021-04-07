import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-partial-loader',
    templateUrl: './partial-loader.component.html',
    styleUrls: ['./partial-loader.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartialLoaderComponent implements OnInit, OnDestroy {

    constructor() {
    }

    ngOnInit(): void {
        const filtri = document.getElementsByClassName('loading-prevent-click-not');
        if (filtri && filtri.length > 0) {
            for (let i = 0; i <= filtri.length; i++) {
                if (filtri[i]) {
                    filtri[i].classList.add('loading-prevent-click');
                }
            }
        }
    }

    ngOnDestroy(): void {
        const filtri = document.getElementsByClassName('loading-prevent-click-not');
        if (filtri && filtri.length > 0) {
            for (let i = 0; i <= filtri.length; i++) {
                if (filtri[i]) {
                    filtri[i].classList.remove('loading-prevent-click');
                }
            }
        }
    }

}
