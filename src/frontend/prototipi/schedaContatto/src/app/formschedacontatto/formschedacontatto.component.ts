import { Component, OnInit, Input } from '@angular/core';
import { SchedaContatto} from './scheda-contatto.model';
//import { SchedaContattoService} from './scheda-contatto.service';
import { FriendlyDatePipe } from '../shared/pipes/friendly-date.pipe';
import { FriendlyHourPipe } from '../shared/pipes/friendly-hour.pipe';


@Component({
  selector: 'app-formschedacontatto',
  templateUrl: './formschedacontatto.component.html',
  styleUrls: ['./formschedacontatto.component.css']
})
export class FormschedacontattoComponent implements OnInit {

@Input() scheda: SchedaContatto;

  //Modifica apportata da Marzotti per visualizzare la lista delle schede contatto - 13/07
  //constructor(private schedaContattoService : SchedaContattoService) {  
  //}
  constructor() {  
  }

  ngOnInit() {
  }

    get fs(): SchedaContatto {
          //Modifica apportata da Marzotti per visualizzare la lista delle schede contatto - 13/07
          //return this.schedaContattoService.Get();
          return this.scheda;

    }
 
}


