import { Component, OnInit } from '@angular/core';
import { MezzoInServizio} from './mezzoinservizio.model';
import { MezzoInServizioService} from './mezzo-in-servizio.service';


@Component({
  selector: 'app-mezzoinservizio',
  templateUrl: './mezzoinservizio.component.html',
  styleUrls: ['./mezzoinservizio.component.css']
})
export class MezzoinservizioComponent implements OnInit {

  constructor(private mezzoInServizioService : MezzoInServizioService) { }

  ngOnInit() {
  }
  get fs(): MezzoInServizio {

          return this.mezzoInServizioService.Get();

    }
 }



  