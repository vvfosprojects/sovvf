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

      // Attendo che arrivi il mezzo per selezionare la prima squadra nella lista ....
      // (dovrà essere fatta la logica che restituisce la squadra migliore da selezionare).
      // this.compMezzoSquadra.setSquadra(this.squadre[0]);
    });
    // Resto in ascolto per un eventuale squadra selezionata
    this.compMezzoSquadra.getSquadra().subscribe((squadre: Squadra[]) => {
      if (squadre) {
        console.log('Squadre: ', squadre);
        this.partenze[this.idPartenzaAttuale].squadra = [];
        squadre.forEach(s => {
          this.setSquadra(s, this.idPartenzaAttuale);
        });
      }
    });
    // Resto in ascolto per ricevere le partenze create fino ad adesso
    this.compMezzoSquadra.getPartenze().subscribe((partenze: BoxPartenza[]) => {
      if (partenze) {
        this.partenze = partenze;
        console.log('Partenze: ', this.partenze);
      }
    });
  }

  ngOnInit() {
  }

  nuovaPartenza(id: number) {
    // Controllo se ci sono già partenze con questo id
    let partenzaDuplicata = false;
    this.partenze.forEach((p: BoxPartenza) => {
      if (p.id === id) {
        console.log('partenza duplicata');
        partenzaDuplicata = true;
      }
    });

    // Se non ci sono partenze con lo stesso id creo un nuova partenza
    if (!partenzaDuplicata) {
      const newPartenza = new BoxPartenza(id);
      this.compMezzoSquadra.setPartenze(newPartenza);
      this.compMezzoSquadra.clearSquadra();
    }
  }

  setMezzo(mezzo: MezzoComposizione, id: number) {
    this.partenze[id].mezzoComposizione = mezzo;
  }

  setSquadra(squadra: Squadra, id: number) {
    this.partenze[id].squadra.push(squadra);
  }

  nuovoMezzo() {
    this.idPartenzaAttuale += 1;
  }

  changeMode(newMode: string) {
    this.partenzaS.changeCompPartenzaMode(newMode);
  }
}
