import { Component, OnInit, Input } from '@angular/core';

// Service
import { PartenzaService } from '../service/partenza/partenza.service';
import { CompPartenzaManagerService } from '../../core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { CompMezzoSquadraService } from '../service/comp-mezzo-squadra/comp-mezzo-squadra.service';

// Model
import { BoxPartenza } from '../model/box-partenza.model';
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

  mezziComposizione: MezzoComposizione[];
  squadre: Squadra[];

  partenze: BoxPartenza[] = [];
  idPartenzaAttuale = 0;

  constructor(private partenzaS: PartenzaService,
    private compPartenzaManager: CompPartenzaManagerService,
    private compMezzoSquadra: CompMezzoSquadraService) {
    // Prendo i mezzi da visualizzare nella lista
    this.compPartenzaManager.getMezziComposizione().subscribe((mezziComp: MezzoComposizione[]) => {
      this.mezziComposizione = mezziComp;
    });
    // Prendo le squadre da visualizzare nella lista
    this.compPartenzaManager.getSquadre().subscribe((squadre: Squadra[]) => {
      this.squadre = squadre;
    });
    // Resto in ascolto per un eventuale mezzo selezionato
    this.compMezzoSquadra.getMezzo().subscribe((mezzo: MezzoComposizione) => {
      this.nuovaPartenza(this.idPartenzaAttuale);
      this.setMezzo(mezzo, this.idPartenzaAttuale);
    });
    // Resto in ascolto per un eventuale squadra selezionata
    this.compMezzoSquadra.getSquadra().subscribe((squadra: Squadra) => {
      this.setSquadra(squadra, this.idPartenzaAttuale);
    });
  }

  ngOnInit() {
  }

  nuovaPartenza(id: number) {
    // Controllo se ci sono già partenze con questo id
    let partenzaDuplicata = false;
    this.partenze.forEach((p: BoxPartenza) => {
      if (p.id === id) {
        partenzaDuplicata = true;
      }
    });

    // Se non ci sono partenze con lo stesso id creo un nuova partenza
    if(!partenzaDuplicata) {
      this.partenze.push(
        new BoxPartenza(
          id
        )
      );
      this.compMezzoSquadra.setPartenze(this.partenze);
    }
  }

  setMezzo(mezzo: MezzoComposizione, id: number) {
    this.partenze[id].mezzoComposizione = mezzo;
  }

  setSquadra(squadra: Squadra, id: number) {
    this.partenze[id].squadra = squadra;
  }

  nuovoMezzo() {
    this.idPartenzaAttuale += 1;
  }

  changeMode(newMode: string) {
    this.partenzaS.changeCompPartenzaMode(newMode);
  }
}
