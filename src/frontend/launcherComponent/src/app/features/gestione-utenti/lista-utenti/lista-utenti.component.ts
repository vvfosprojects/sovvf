import {Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import {Utente} from 'src/app/shared/model/utente.model';
import {NgbAccordion, NgbAccordionConfig, NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lista-utenti',
  templateUrl: './lista-utenti.component.html',
  styleUrls: ['./lista-utenti.component.css']
})
export class ListaUtentiComponent implements OnInit {
  @Input() ricercaUtenti: any;
  @Input() utenti: Utente[];

  constructor(private config: NgbAccordionConfig) {
    config.closeOthers = true;
    config.type = 'primary';
  }

  ngOnInit() {
    // console.log('Utenti', this.utenti);
  }
}
