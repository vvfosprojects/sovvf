import { Component, OnInit, Input } from '@angular/core';
import { PartenzaService } from '../service/partenza/partenza.service';
import { PreAccoppiato } from '../model/pre-accoppiato.model';
import { Mezzo } from 'src/app/shared/model/mezzo.model';
import { Squadra } from 'src/app/shared/model/squadra.model';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

@Component({
  selector: 'app-slower',
  templateUrl: './slower.component.html',
  styleUrls: ['./slower.component.css']
})
export class SlowerComponent implements OnInit {
  @Input() richiesta: SintesiRichiesta;
  
  preAcc: PreAccoppiato;

  constructor(private partenzaS: PartenzaService) { }

  ngOnInit() {
    this.preAcc = new PreAccoppiato(
      '1',
      new Mezzo('1', 'A1', 'APS', 'inSede', [], 0),
      new Squadra('Rossa', 'InSede', []),
      'Tuscolana II',
      23.5,
      '5.6 min'
    );
  }

  changeMode(newMode: string) {
    this.partenzaS.changeCompPartenzaMode(newMode);
  }
}
