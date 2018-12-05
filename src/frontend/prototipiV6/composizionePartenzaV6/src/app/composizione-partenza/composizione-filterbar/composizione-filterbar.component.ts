import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-composizione-filterbar',
  templateUrl: './composizione-filterbar.component.html',
  styleUrls: ['./composizione-filterbar.component.css']
})
export class ComposizioneFilterbarComponent implements OnInit {
  generiMezzi = ['APS', 'APS 2', 'APS 3'];
  distaccamenti = ['Roma', 'Frosinone', 'Latina', 'Rieti'];
  stati = ['In Sede' , 'In Viaggio', 'In Rientro', 'Sul Posto'];

  constructor() { }

  ngOnInit() {
  }

}
