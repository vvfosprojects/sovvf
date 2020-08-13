import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ricerca-trasferimento-chiamata',
  templateUrl: './ricerca-trasferimento-chiamata.component.html',
  styleUrls: ['./ricerca-trasferimento-chiamata.component.css']
})
export class RicercaTrasferimentoChiamataComponent implements OnInit {

  @Input() loading: boolean;
  ricerca: string;

  @Output() ricercaChange = new EventEmitter<any>();

  constructor(config: NgbDropdownConfig) {
    config.placement = 'bottom-right';
}


  ngOnInit() {
  }

}
