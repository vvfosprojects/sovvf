import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RicercaPersonaFakeService } from '../service/ricerca-persona-fake.service';
import { UnitaOperativa } from 'app/model/unita-operativa.model';
import { Persona } from 'app/model/persona.model';
import { UnitaOperativaComponent } from 'app/unita-operativa/unita-operativa.component';
import { RisultatoRicerca } from 'app/model/risultato-ricerca.model';
import { DatiRicerca } from 'app/model/dati-ricerca.model';

@Component({
  selector: 'app-cerca-nominativo',
  templateUrl: './cerca-nominativo.component.html',
  styleUrls: ['./cerca-nominativo.component.css']
})
export class CercaNominativoComponent implements OnInit {
  @Input() risultatiRicerca: RisultatoRicerca[];
  @Output() ricerca: EventEmitter<DatiRicerca> = new EventEmitter<DatiRicerca>();
  @Output() selezione: EventEmitter<string> = new EventEmitter<string>();
    
  
  nominativo: string;
  filteredNames: any[];
  nodoSelezionato : boolean = false;

  constructor( private RicercaPersonaFakeService: RicercaPersonaFakeService) { }

  ngOnInit() {
  }

  private clearSearchText(): void {
    this.nominativo = null;
    console.log("Cancellato " + this.nominativo);
  }
  

  nodochecked() {
    if (this.nodoSelezionato) this.nodoSelezionato = false;
    else this.nodoSelezionato = true;

    this.ricerca.emit({stringaLike : this.nominativo, nodoSelezionato : this.nodoSelezionato});
    console.log("Nominativo: " + this.nominativo);
    console.log("Ricerca nel nodo selezionato: " + this.nodoSelezionato); 
  }

  //il metodo genera evento per il backend inviando i dati per la ricerca dei nominativi che
  //rispondono ai criteri selezionati
  filterNameSingle(event) {
    this.ricerca.emit({stringaLike : this.nominativo, nodoSelezionato : this.nodoSelezionato});
    console.log("Nominativo: " + this.nominativo);
    console.log("Ricerca nel nodo selezionato: " + this.nodoSelezionato);
    
        let query = event.query;
        this.RicercaPersonaFakeService.cerca(this.nominativo, this.nodoSelezionato)
            .subscribe(names => {
               this.filteredNames = this.filterName(query, names);
        });
    }

    filterName(query, names: any[]): any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        for (let i = 0; i < names.length; i++) {
            let nominativo = names[i];
            if (nominativo.descrizione.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                filtered.push(nominativo.descrizione);
            }

        }
        this.risultatiRicerca = filtered;
        console.log("risultati: " + filtered);
        return filtered;
    }

    selezionaNominativo(event: any) {
        this.nominativo = event;
        console.log("this.nominativo: " + this.nominativo);
        this.selezione.emit(this.nominativo);
    }

}
