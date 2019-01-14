import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-composizione-filterbar',
  templateUrl: './composizione-filterbar.component.html',
  styleUrls: ['./composizione-filterbar.component.css']
})
export class ComposizioneFilterbarComponent implements OnInit {
  generiMezzi = ['APS', 'ABP', 'AG', 'AS'];
  distaccamenti = ['Roma', 'Frosinone', 'Latina', 'Rieti'];
  stati = ['In Sede', 'In Viaggio', 'In Rientro', 'Sul Posto'];

  constructor() { }

  ngOnInit() {
  }

  iconaStatiClass(stato: string) {
    let returnClass = '';

    switch (stato) {
      case 'In Sede':
        returnClass = 'text-secondary';
        break;
      case 'In Viaggio':
        returnClass = 'text-info';
        break;
      case 'In Rientro':
        returnClass = 'text-primary';
        break;
      case 'Sul Posto':
        returnClass = 'text-success';
        break;

      default:
        break;
    }

    return returnClass;
  }
}
