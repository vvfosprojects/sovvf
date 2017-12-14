import { Component, OnInit } from '@angular/core';

import { InfoAggregate } from './info-aggregate/info-aggregate.model';
import { InfoAggregateComponent } from './info-aggregate/info-aggregate.component';
import { InfoAggregateService } from "./info-aggregate/info-aggregate.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  private informazioni: InfoAggregate[] = [];

  constructor(private infoAggregateService: InfoAggregateService) {
  }

  ngOnInit() {
    this.infoAggregateService.getInfoAggregate()
      .subscribe(informazioni => {
        console.log("Informazioni service: ", informazioni);
        this.informazioni = informazioni;
      });
  }

  // showDettagliRicevuto(informazioni: InfoAggregate): void {
  //   console.log("Sono app.component. Vogliono vedere i dettagli di", informazioni);
  // }
}
