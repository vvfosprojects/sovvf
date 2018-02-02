import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RicercaPersonaFakeService } from '../service/ricerca-persona-fake.service';
import { UnitaOperativa } from 'app/model/unita-operativa.model';
import { UnitaOperativaComponent } from 'app/unita-operativa/unita-operativa.component';
import { RicercaEvent } from 'app/model/ricerca-event.model';
import { Persona } from 'app/model/persona.model';

@Component({
  selector: 'app-cerca-nominativo',
  templateUrl: './cerca-nominativo.component.html',
  styleUrls: ['./cerca-nominativo.component.css']
})
export class CercaNominativoComponent implements OnInit {
  @Input() unitaOperativa: UnitaOperativa;
  @Output() cerca: EventEmitter<string> = new EventEmitter<string>();

  nominativo: any;
  filteredNames: any[];

  constructor( private RicercaPersonaFakeService: RicercaPersonaFakeService) { }

  ngOnInit() {
  }

  private clearSearchText(): void {
    this.nominativo = null;
    this.cerca.emit(this.nominativo);
  }

  public leggiUnitaOperativa(event) {
    console.log("la ricerca sarà effettuata in unità operativa" + event.unitaOperSel);
  }
 

  filterNameSingle(event) {
    this.cerca.emit(this.nominativo);
    console.log("nominativo " + this.nominativo);

        /* let query = event.query;
        this.RicercaPersonaFakeService.cerca(event, this.unitaOperativa).subscribe(names => {
            this.filteredNames = this.filterName(query, names);
        });
        //console.log("filteredNames: " + this.filteredNames); */
    }

    /* filterName(query, names: any[]): any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        for (let i = 0; i < names.length; i++) {
            let nominativo = names[i];
            if (nominativo.descrizione.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                filtered.push(nominativo.descrizione);
            }

        }
        return filtered;
    } */

}
