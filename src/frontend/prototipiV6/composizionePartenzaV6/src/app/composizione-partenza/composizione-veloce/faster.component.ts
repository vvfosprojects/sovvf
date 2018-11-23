import { Component, OnInit } from '@angular/core';

// Model
import { PreAccoppiato } from '../model/pre-accoppiato.model';
import { CompPartenzaManagerService } from 'src/app/core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { PreAccoppiatiService } from '../service/pre-accoppiati/pre-accoppiati.service';

@Component({
  selector: 'app-faster',
  templateUrl: './faster.component.html',
  styleUrls: ['./faster.component.css']
})
export class FasterComponent implements OnInit {
  preAccoppiati: PreAccoppiato[];
  preAccoppiatiSelezionati: PreAccoppiato[] = [];

  constructor(private compPartenzaManager: CompPartenzaManagerService,
    private preAccoppiatiS: PreAccoppiatiService) {
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

  preAccoppiatoSelezionato(preAccoppiato){
    this.preAccoppiatiS.sendPreAccoppiatoSelezionato(preAccoppiato);
  }

  cardClasses(preAccoppiato): string {
    let returnClass = 'status_preaccoppiato_nonselezionato app-shadow-danger';
    if(this.preAccoppiatiSelezionati){
      this.preAccoppiatiSelezionati.forEach(preAcc => {
        if (preAcc === preAccoppiato){
          returnClass = 'status_preaccoppiato_selezionato  app-shadow-primary';
        }
      });
    }
    return returnClass;
  }
}
