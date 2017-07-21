import { Component } from '@angular/core';
import { SchedaContattoService } from './formschedacontatto/scheda-contatto.service'
import { ListaSchedeService_FakeJson } from "app/lista-schede/lista-schede-fake-json.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ListaSchedeService_FakeJson]
  //Modifica apportata da Marzotti per visualizzare la lista delle schede contatto - 13/07
  //providers: [SchedaContattoService]
})
export class AppComponent {
  title = 'app works!';
}

