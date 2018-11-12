import { Component, OnInit } from '@angular/core';
import { TipologieService } from '../../shared/tipologie/tipologie.service';
import { FilterbarService } from '../../filterbar/filterbar-service/filterbar-service.service';
import { ClipboardService } from 'ngx-clipboard';
import { Localita } from 'src/app/shared/model/localita.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';

@Component({
  selector: 'app-scheda-telefonata',
  templateUrl: './scheda-telefonata.component.html',
  styleUrls: ['./scheda-telefonata.component.css']
})
export class SchedaTelefonataComponent implements OnInit {
  coords: Localita;
  tipologie: any;

  constructor(private tipologieS: TipologieService,
    private viewService: FilterbarService,
    private _clipboardService: ClipboardService) { }

  ngOnInit() {
    this.tipologieS.getTipologie().subscribe(t => {
      this.tipologie = t;
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
    this.viewService.sendView({
      richieste: true,
      mappa: true,
      split: true,
      chiamata: false,
    });
  }
}
