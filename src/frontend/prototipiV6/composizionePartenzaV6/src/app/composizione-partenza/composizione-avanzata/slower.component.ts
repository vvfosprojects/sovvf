import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

// Service
import { PartenzaService } from '../service/partenza/partenza.service';
import { CompPartenzaManagerService } from '../../core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { CompMezzoSquadraService } from '../service/comp-mezzo-squadra/comp-mezzo-squadra.service';

// Model
import { BoxPartenza } from '../model/box-partenza.model';
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

  errore: string;

  constructor(private partenzaS: PartenzaService,
    private compPartenzaManager: CompPartenzaManagerService,
    private compMezzoSquadra: CompMezzoSquadraService,
    popoverConfig: NgbPopoverConfig,
    tooltipConfig: NgbTooltipConfig) {
    // Popover options
    popoverConfig.container = 'body';
    popoverConfig.placement = 'top';
    // Tooltip options
    tooltipConfig.container = 'body';
    tooltipConfig.placement = 'top';

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
      console.log('Mezzi:', mezzo);
      this.nuovaPartenza(this.idPartenzaAttuale);
      this.setMezzo(mezzo, this.idPartenzaAttuale);
    });
    // Re sto in ascolto per un eventuale squadra selezionata
    this.compMezzoSquadra.getSquadra().subscribe((squadre: Squadra[]) => {
      if (squadre) {
        // console.log('Squadre:', squadre);
        this.partenze[this.idPartenzaAttuale].squadra = [];
        squadre.forEach(s => {
          this.setSquadra(s, this.idPartenzaAttuale);
        });
        // controllo se ci sono squadre duplicate per far uscire l'alert (DA FARE!!)
      }
    });
    // Resto in ascolto per ricevere le partenze create fino ad adesso
    this.compMezzoSquadra.getPartenze().subscribe((partenze: BoxPartenza[]) => {
      if (partenze) {
        // console.log('Partenze:', this.partenze);
        this.partenze = partenze;
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

      // Attendo che venga creata una nuova partenza per selezionare la prima squadra nella lista
      // (dovrà essere fatta la logica che restituisce la squadra più opportuna da selezionare).
      this.compMezzoSquadra.setSquadra(this.squadre[0]);
    }
  }

  eliminaPartenza(partenza: BoxPartenza) {
    console.log('Partenza da eliminare', partenza);
    if (this.partenze[this.idPartenzaAttuale - 1]) {
      this.idPartenzaAttuale = this.idPartenzaAttuale - 1;
    } else {
      this.idPartenzaAttuale = 0;
      this.compMezzoSquadra.clearMezzo();
    }
    this.compMezzoSquadra.clearSinglePartenza(partenza);
  }

  setMezzo(mezzo: MezzoComposizione, id: number) {
    this.partenze[id].mezzoComposizione = mezzo;
  }

  setSquadra(squadra: Squadra, id: number) {
    this.partenze[id].squadra.push(squadra);
  }

  nuovoMezzo() {
    this.idPartenzaAttuale = this.partenze.length;
  }

  changeMode(newMode: string) {
    this.partenzaS.changeCompPartenzaMode(newMode);
  }

  modificaPartenza(partenza) {
    this.idPartenzaAttuale = partenza.id;
  }
}
