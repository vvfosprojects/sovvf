import { Component, OnInit, Input } from '@angular/core';

// Model
import { BoxPartenza } from '../model/box-partenza.model';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Service
import { CompPartenzaManagerService } from 'src/app/core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { PreAccoppiatiService } from '../service/pre-accoppiati/pre-accoppiati.service';
import { PartenzaService } from '../service/partenza/partenza.service';

@Component({
  selector: 'app-faster',
  templateUrl: './faster.component.html',
  styleUrls: ['./faster.component.css']
})
export class FasterComponent implements OnInit {
  @Input() richiesta: SintesiRichiesta;

  preAccoppiati: BoxPartenza[];
  preAccoppiatiSelezionati: BoxPartenza[] = [];

  constructor(private compPartenzaManager: CompPartenzaManagerService,
    private preAccoppiatiS: PreAccoppiatiService,
    private partenzaS: PartenzaService) {
    // Restituisce i PreAccoppiati
    this.compPartenzaManager.getPreAccoppiati().subscribe((preAccoppiati: BoxPartenza[]) => {
      this.preAccoppiati = preAccoppiati;
      console.log(preAccoppiati);
    });
    // Restituisce i PreAccoppiati selezionati
    this.preAccoppiatiS.getPreAccoppiatiSelezionati().subscribe((res: any) => {
      this.preAccoppiatiSelezionati = res;
    });
  }

  ngOnInit() {
  }

  preAccoppiatoSelezionato(preAcc: BoxPartenza) {
    this.preAccoppiatiS.sendPreAccoppiatoSelezionato(preAcc);
  }
}
