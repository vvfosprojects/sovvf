import { Component, OnInit } from '@angular/core';
import { TipologieService } from '../shared/tipologie/tipologie.service';
import { FilterbarService } from '../filterbar/filterbar-service/filterbar-service.service';

@Component({
  selector: 'app-chiamata',
  templateUrl: './chiamata.component.html',
  styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit {
  tipologie: any;

  constructor(private tipologieS: TipologieService, private viewService: FilterbarService) { }

  ngOnInit() {
    this.tipologieS.getTipologie().subscribe(t => {
      this.tipologie = t;
    });
  }

  annullaChiamata() {
    this.viewService.sendView({
        richieste: true,
        mappa: true,
        split: true,
        chiamata: false,
    });
  }
}
