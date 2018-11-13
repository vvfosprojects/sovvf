import { Component, OnInit } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { TipologieService } from '../../shared/tipologie/tipologie.service';
import { FilterbarService } from '../../filterbar/filterbar-service/filterbar-service.service';
import { ClipboardService } from 'ngx-clipboard';
import { Localita } from 'src/app/shared/model/localita.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';

@Component({
  selector: 'app-scheda-telefonata',
  templateUrl: './scheda-telefonata.component.html',
  styleUrls: ['./scheda-telefonata.component.css'],
  animations: [
    trigger('hideShowAnimator', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('0 => 1', animate('.1s')),
      transition('1 => 0', animate('.1s'))
    ])
  ]
})
export class SchedaTelefonataComponent implements OnInit {
  coords: Localita;
  tipologie: any;
  hideShowAnimator = false;

  constructor(private tipologieS: TipologieService,
    private viewService: FilterbarService,
    private _clipboardService: ClipboardService) { }

  ngOnInit() {
    this.tipologieS.getTipologie().subscribe(t => {
      this.tipologie = t;
      setTimeout(() => {
        this.hideShowAnimator = true;
      }, 1);
    });

  }

  handleAddressChange(result) {
    this.coords = new Localita(new Coordinate(result.geometry.location.lat(), result.geometry.location.lng()));
    // console.log(this.coords);
  }

  copy(lat: number, lng: number) {
    const copiedText = lat.toString() + ', ' + lng.toString();
    this._clipboardService.copyFromContent(copiedText);
    // console.log(copiedText);
  }

  annullaChiamata() {
    this.hideShowAnimator = false;
    setTimeout(() => {
      this.viewService.sendView({
        richieste: true,
        mappa: true,
        split: true,
        chiamata: false,
      });
    }, 100);
  }
}
