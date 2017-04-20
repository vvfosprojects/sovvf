import { Component } from '@angular/core';
import { MezzoInServizioService} from './mezzoinservizio/mezzo-in-servizio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MezzoInServizioService]
})
export class AppComponent {
  title = 'app works!';
}
