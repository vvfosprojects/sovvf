import { routerTransition } from '../../router.animations';

/////////////////

import { Component, OnInit, Input } from '@angular/core';
import { SchedaContatto} from './scheda-contatto.model';
//import { SchedaContattoService} from './scheda-contatto.service';
import { FriendlyDatePipe } from '../../shared/pipes/friendly-date.pipe';
import { FriendlyHourPipe } from '../../shared/pipes/friendly-hour.pipe';

import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { ListaSchedeService_FakeJson } from "../lista-schede/lista-schede-fake-json.service";
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'scheda-contatto-page',
    templateUrl: './scheda-contatto.component.html',
    styleUrls: ['./scheda-contatto.component.scss'],
    animations: [routerTransition()]
})
export class SchedaContattoComponent implements OnInit {
    @Input() scheda: SchedaContatto;
    //Modifica apportata da Marzotti per visualizzare la lista delle schede contatto - 13/07
  //constructor(private schedaContattoService : SchedaContattoService) {  
  //}
  constructor(private route: ActivatedRoute, private router: Router,
    private listaSchedeService_FakeJson: ListaSchedeService_FakeJson) {  
}

ngOnInit() {
    //Modifica apportata da Marzotti per visualizzare la lista delle schede contatto - 21/07
    /* The switchMap operator also cancels previous in-flight requests. 
     If the user re-navigates to this route with a new id while the HeroService is still 
     retrieving the old id, switchMap discards that old request and returns the hero for the 
     new id.
    */
    this.route.paramMap
    .switchMap((params: ParamMap) =>
      this.listaSchedeService_FakeJson.getScheda(params.get('id')))
    .subscribe((scheda: SchedaContatto) => this.scheda = scheda);
  }

  get fs(): SchedaContatto {
    //Modifica apportata da Marzotti per visualizzare la lista delle schede contatto - 13/07
    //return this.schedaContattoService.Get();
    return this.scheda;
}

// private tornaIndietro() {
//   this.router.navigate(['/']);
// }
}
