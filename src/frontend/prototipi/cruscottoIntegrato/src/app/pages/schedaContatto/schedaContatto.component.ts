import { Component } from '@angular/core';
import { SchedaContattoService } from './formschedacontatto/scheda-contatto.service'

@Component({
  selector: 'schedaContatto',
  templateUrl: './schedaContatto.html',
  styleUrls: ['./schedaContatto.scss'],
  providers: [SchedaContattoService]
})
export class schedaContattoComponent {
  //title = 'app works!';
}