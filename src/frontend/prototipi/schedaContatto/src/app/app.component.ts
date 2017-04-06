import { Component } from '@angular/core';
import { SchedaContattoService } from './formschedacontatto/scheda-contatto.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SchedaContattoService]
})
export class AppComponent {
  title = 'app works!';
}

