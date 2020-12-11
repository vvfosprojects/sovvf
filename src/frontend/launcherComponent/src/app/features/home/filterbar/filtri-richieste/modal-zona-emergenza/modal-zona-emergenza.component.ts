import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-zona-emergenza',
  templateUrl: './modal-zona-emergenza.component.html',
  styleUrls: ['./modal-zona-emergenza.component.css']
})
export class ModalZonaEmergenzaComponent implements OnDestroy {

  subscription: Subscription = new Subscription();

  zonaEmergenzaArrayFake: any = [
    {
      name: 'Zona Emergenza Fake 1',
      selected: false,
    },
    {
      name: 'Zona Emergenza Fake 2',
      selected: false,
    },
    {
      name: 'Zona Emergenza Fake 3',
      selected: false,
    },
    {
      name: 'Zona Emergenza Fake 4',
      selected: false,
    },
  ];

  constructor(private modal: NgbActiveModal) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  chiudiModalFiltriTipologia(closeRes: string): void {
    this.modal.close(this.zonaEmergenzaArrayFake.filter(x => x.selected).map(x => x.name));
  }

  onBoxClick(i): void {
    this.zonaEmergenzaArrayFake[i].selected = !this.zonaEmergenzaArrayFake[i].selected;
  }
}
