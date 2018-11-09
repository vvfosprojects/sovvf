import { Component, OnInit } from '@angular/core';
import { TipologieService } from '../shared/tipologie/tipologie.service';

@Component({
  selector: 'app-chiamata',
  templateUrl: './chiamata.component.html',
  styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit {
  tipologie: any;

  constructor(private tipologieS: TipologieService) { }

  ngOnInit() {
    this.tipologieS.getTipologie().subscribe(t => {
      this.tipologie = t;
    });
  }
}
