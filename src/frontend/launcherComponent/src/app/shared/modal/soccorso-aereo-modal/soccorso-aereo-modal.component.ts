import { Component, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-soccorso-aereo-modal',
  templateUrl: './soccorso-aereo-modal.component.html',
  styleUrls: ['./soccorso-aereo-modal.component.css']
})

export class SoccorsoAereoModalComponent implements OnDestroy {

  subscription: Subscription = new Subscription();

  azioniArrayFake = [
    {
    cod: 'A',
    descrizione: 'Soccorso a persona',
    checked: false,
    },
    {
      cod: 'B',
      descrizione: 'Spegnimento con Benna',
      checked: false,
    },
    {
      cod: 'C',
      descrizione: 'Ricognizione',
      checked: false,
    },
    {
      cod: 'D',
      descrizione: 'Trasporto personale',
      checked: false,
    },
    {
      cod: 'E',
      descrizione: 'Trasporto attrezzature',
      checked: false,
    },
    {
      cod: 'A',
      descrizione: 'Soccorso a persona',
      checked: false,
    },
    {
      cod: 'E',
      descrizione: 'Trasporto attrezzature',
      checked: false,
    },
  ];

  constructor(private modal: NgbActiveModal) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCheck(i: number): void {
    this.azioniArrayFake[i].checked = !this.azioniArrayFake[i].checked;
  }

  chiudiModalSoccorsoAereo(closeRes: string): void {
    this.modal.close(closeRes);
  }

}
