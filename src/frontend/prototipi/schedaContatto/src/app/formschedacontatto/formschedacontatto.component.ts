import { Component, OnInit } from '@angular/core';
import { SchedaContatto} from './scheda-contatto.model';
import { SchedaContattoService} from './scheda-contatto.service';


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
/*
export class ListaPostComponent implements OnInit {
  constructor(private listaPostService: ListaPostService) { }

  ngOnInit() {
  }

  public numeroPosts(): number {
    return this.listaPostService.posts.length;
  }

  get posts(): Post[] {
    return this.listaPostService.posts;
  }
}

*/

