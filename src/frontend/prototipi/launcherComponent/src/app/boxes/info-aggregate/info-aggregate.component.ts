import { Component, OnInit} from '@angular/core';

import { InfoAggregate } from '../boxes-services/info-aggregate.model';
import { InfoAggregateService } from '../boxes-services/info-aggregate.service';

@Component({
  selector: 'app-info-aggregate',
  templateUrl: './info-aggregate.component.html',
  styleUrls: ['./info-aggregate.component.css']
})
export class InfoAggregateComponent implements OnInit {
  informazioni: InfoAggregate;

  constructor(private infoAggregateService: InfoAggregateService) {}

  ngOnInit() {
    this.infoAggregateService.getInfoAggregate()
      .subscribe(informazioni => {
        // console.log("Informazioni service: ", informazioni.interventi);
        this.informazioni = informazioni;
      });
  }
}
