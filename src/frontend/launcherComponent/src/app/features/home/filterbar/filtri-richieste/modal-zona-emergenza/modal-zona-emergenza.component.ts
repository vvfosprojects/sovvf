import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-zona-emergenza',
  templateUrl: './modal-zona-emergenza.component.html',
  styleUrls: ['./modal-zona-emergenza.component.css']
})
export class ModalZonaEmergenzaComponent implements OnInit, OnDestroy {

  nessunaZonaSelected = false;
  nessunaZonaLocked = false;
  zoneEmergenzaLocked = false;
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

  ngOnInIt(): void {
    this.nessunaZonaSelected = false;
    this.zonaEmergenzaArrayFake.forEach(e => e.selected = false);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  chiudiModalFiltriTipologia(closeRes: string): void {
    if (!this.zoneEmergenzaLocked && this.nessunaZonaLocked) {
      this.modal.close(this.zonaEmergenzaArrayFake.filter(x => x.selected).map(x => x.name));
    } else if (!this.nessunaZonaLocked && this.zoneEmergenzaLocked) {
      this.modal.close('Nessuna zona emergenza');
    } else { this.modal.close(null); }
  }

  onBoxClick(i): void {
    this.zonaEmergenzaArrayFake[i].selected = !this.zonaEmergenzaArrayFake[i].selected;
    this.nessunaZonaLocked = true;
  }

  onClickNessunaZona(): void {
    this.nessunaZonaSelected = !this.nessunaZonaSelected;
    this.zoneEmergenzaLocked = true;
  }

  onResetZoneEmergenza(): void {
    this.zoneEmergenzaLocked = false;
    this.nessunaZonaLocked = false;
    this.nessunaZonaSelected = false;
    this.zonaEmergenzaArrayFake.forEach(e => e.selected = false);
  }

  ngOnInit(): void {
  }
}
