
import { Component } from '@angular/core';
import { SquadraInServizioService} from 'squadra-in-servizio/  /SquadraInServizioService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SquadraInServizioService]
})
export class AppComponent {
  title = 'app works!';
}
