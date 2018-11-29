import { Component, OnInit, Input } from '@angular/core';

// Service
import { PartenzaService } from '../service/partenza/partenza.service';
import { CompPartenzaManagerService } from '../../core/manager/comp-partenza-manager/comp-partenza-manager.service';

// Model
import { PreAccoppiato } from '../model/pre-accoppiato.model';
import { Mezzo } from '../../shared/model/mezzo.model';
import { Squadra } from '../..//shared/model/squadra.model';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { MezzoComposizione } from '../model/mezzo-composizione.model';

@Component({
  selector: 'app-slower',
  templateUrl: './slower.component.html',
  styleUrls: ['./slower.component.css']
})
export class SlowerComponent implements OnInit {
  @Input() richiesta: SintesiRichiesta;

  preAcc: PreAccoppiato;
  mezziComposizione: MezzoComposizione[];
  squadre: Squadra[];

  constructor(private partenzaS: PartenzaService,
    private compPartenzaManager: CompPartenzaManagerService) {
      
      this.compPartenzaManager.getMezziComposizione().subscribe((mezziComp: MezzoComposizione[]) => {
        console.log(mezziComp);
        this.mezziComposizione = mezziComp;
      });

      this.compPartenzaManager.getSquadre().subscribe((squadre: Squadra[]) => {
        console.log(squadre);
        this.squadre = squadre;
      });
  }

  ngOnInit() {
    this.preAcc = new PreAccoppiato(
      '1',
      new Mezzo('1', 'A1', 'APS', 'inSede', [], 0),
      new Squadra('Rossa', 'InSede', []),
      'Tuscolano II',
      23.5,
      '5.6 min'
    );
  }

  changeMode(newMode: string) {
    this.partenzaS.changeCompPartenzaMode(newMode);
  }

  hoverIn() {
    console.log('Hover in');
  }
}
