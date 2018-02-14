import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchedaContatto } from "../scheda-contatto/scheda-contatto.model";
import { ListaSchedeService } from "../lista-schede/lista-schede.service";
import { ListaSchedeService_FakeJson } from "../lista-schede/lista-schede-fake-json.service";
import { Router } from "@angular/router";
import { routerTransition } from '../../router.animations';


@Component({
  selector: 'app-lista-schede',
  templateUrl: './lista-schede.component.html',
  styleUrls: ['./lista-schede.component.css'],
  animations: [routerTransition()]
})

 
export class ListaSchedeComponent implements OnInit {

@Input() scheda: SchedaContatto;

@Output() showDetail: EventEmitter<SchedaContatto> = new EventEmitter();

  private tutteLeSchede: SchedaContatto[];
  schedeFiltrate: SchedaContatto[];
  private errorMessage: string;
  testoRicerca: string;

  constructor(private router: Router, private listaSchedeService_FakeJson: ListaSchedeService_FakeJson) { }

  ngOnInit() {
    this.getSchede();
  }

  
  private getSchede() {
    this.listaSchedeService_FakeJson.getSchede()
      .subscribe(
      schede => {
        this.tutteLeSchede = schede;
        this.schedeFiltrate = schede;
      },
      error => this.errorMessage = <any>error
      )
  }

  private visualizzaScheda(scheda: SchedaContatto) {
    //da cambiare
    //console.log(event.idScheda);
    this.router.navigate(['/scheda-contatto', scheda.idScheda]);
  }

  ricerca(event) {
    this.aggiornaSchedeFiltrate();
  }

   /**
   * Assegna il vettore this.schede filtrando il vettore this.tutteLeSchede in base al testo nel campo
   * Ricerca. 
   */
  private aggiornaSchedeFiltrate() {
    var schede: SchedaContatto[];

    schede = [...this.tutteLeSchede];

    if (!!this.testoRicerca) {
      schede = schede.filter(s => this.ricercaFullText(s, this.testoRicerca));
    }

    this.schedeFiltrate = schede;
  }

  public ricercaFullText(s: SchedaContatto, chiave: string): boolean {
    var chiaveSplit = chiave.split(" ").filter(p => !!p);

    return chiaveSplit.every(pch => {
      return this.testoRicercabileScheda(s).some(p => {
        var regex = new RegExp("^" + pch, 'i');
        return !!p.match(regex);
      });
    });

  }

  public testoRicercabileScheda(s: SchedaContatto): string[] {
    
    // compongo il vettore con tutti i testi
    let v = [
      //public dataOrainserimento: Date 
      ...s.idPostazione.split(" ").filter(p => !!p),
      ...s.nomeUtente.split(" ").filter(p => !!p),
      //public numTelefono: number
      ...s.indirizzo.split(" ").filter(p => !!p),
      ...s.infoAddizionali.split(" ").filter(p => !!p),
      ...s.classificazioneNUE.split(" ").filter(p => !!p),
      ...s.attributiClassificazione.split(" ").filter(p => !!p),
      ...s.note.split(" ").filter(p => !!p),
      //public priorita: number
      ...s.numPersoneCoinvolte.split(" ").filter(p => !!p),
      ...s.competenza.split(" ").filter(p => !!p)
    ];

    return v;
  }

  clearSearchText(): void {
    this.testoRicerca = null;
    this.aggiornaSchedeFiltrate();
  }
}
