import { Component, OnInit } from '@angular/core';

import { InfoAggregate } from './info-aggregate/info-aggregate.model';
import { InfoAggregateComponent } from './info-aggregate/info-aggregate.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  myInfo;

  constructor() {
    this.myInfo = {
        numChiamate: 2,
        numIntAperti:4
    };
}
}
