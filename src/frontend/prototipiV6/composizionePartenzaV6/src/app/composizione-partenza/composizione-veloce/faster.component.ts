import { Component, OnInit, Input } from '@angular/core';

// Model
import { PreAccoppiato } from '../model/pre-accoppiato.model';
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

  preAccoppiati: PreAccoppiato[];
  preAccoppiatiSelezionati: PreAccoppiato[] = [];

  constructor(private compPartenzaManager: CompPartenzaManagerService,
    private preAccoppiatiS: PreAccoppiatiService,
    private partenzaS: PartenzaService) {
    // Restituisce i PreAccoppiati
    this.compPartenzaManager.getPreAccoppiati().subscribe((preAccoppiati: PreAccoppiato[]) => {
      this.preAccoppiati = preAccoppiati;
    });
    // Restituisce i PreAccoppiati selezionati
    this.preAccoppiatiS.getPreAccoppiatiSelezionati().subscribe((res: any) => {
      this.preAccoppiatiSelezionati = res;
    });
  }

  ngOnInit() {
  }

  preAccoppiatoSelezionato(preAcc: PreAccoppiato) {
    this.preAccoppiatiS.sendPreAccoppiatoSelezionato(preAcc);
  }
}
