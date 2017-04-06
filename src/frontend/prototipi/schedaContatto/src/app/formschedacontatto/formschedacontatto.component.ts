import { Component, OnInit } from '@angular/core';
import { SchedaContatto} from './scheda-contatto.model';
import { SchedaContattoService} from './scheda-contatto.service';
import { FriendlyDatePipe } from '../shared/pipes/friendly-date.pipe';


@Component({
  selector: 'app-formschedacontatto',
  templateUrl: './formschedacontatto.component.html',
  styleUrls: ['./formschedacontatto.component.css']
})
export class FormschedacontattoComponent implements OnInit {
//fs : SchedaContatto;

  constructor(private schedaContattoService : SchedaContattoService) {  
  }

  ngOnInit() {
  }

    get fs(): SchedaContatto {

          return this.schedaContattoService.Get();

    }
 
}


