import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-partial-loader',
  templateUrl: './partial-loader.component.html',
  styleUrls: ['./partial-loader.component.css']
})
export class PartialLoaderComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    let filtri = document.getElementsByClassName("loading-prevent-click-not");
    if(filtri && filtri.length > 0) {
      for( let i = 0; i <= filtri.length; i++ )  {
        if(filtri[i]) {
          filtri[i].classList.add('loading-prevent-click')
        }
      }
    }
  }

  ngOnDestroy(): void {
    let filtri = document.getElementsByClassName("loading-prevent-click-not");
    if(filtri && filtri.length > 0) {
      for( let i = 0; i <= filtri.length; i++ )  {
        if(filtri[i]) {
          filtri[i].classList.remove('loading-prevent-click')
        }
      }
    }
  }

}
