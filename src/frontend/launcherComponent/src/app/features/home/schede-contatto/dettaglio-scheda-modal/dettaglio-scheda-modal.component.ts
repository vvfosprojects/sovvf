import { Component, OnInit } from '@angular/core';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';

@Component({
  selector: 'app-dettaglio-scheda-modal',
  templateUrl: './dettaglio-scheda-modal.component.html',
  styleUrls: ['./dettaglio-scheda-modal.component.css']
})
export class DettaglioSchedaModalComponent implements OnInit {

  schedaContatto: SchedaContatto;

  constructor() { }

  ngOnInit() {
  }

}
