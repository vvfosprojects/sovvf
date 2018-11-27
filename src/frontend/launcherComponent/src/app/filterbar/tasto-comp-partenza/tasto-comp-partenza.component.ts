import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PartenzaService } from 'src/app/composizione-partenza/service/partenza/partenza.service';

@Component({
  selector: 'app-tasto-comp-partenza',
  templateUrl: './tasto-comp-partenza.component.html',
  styleUrls: ['./tasto-comp-partenza.component.css']
})
export class TastoCompPartenzaComponent implements OnInit {
  @Output() cambioModalita: EventEmitter<any> = new EventEmitter();
  compPartenzaMode: string;

  constructor(private partenzaS: PartenzaService) {
    this.compPartenzaMode = this.partenzaS.compPartenzaModeIniziale;
    this.partenzaS.getCompPartenzaMode().subscribe(res => {
      this.compPartenzaMode = res;
    });
  }

  ngOnInit() {
  }

  changeMode() {
    switch (this.compPartenzaMode) {
      case 'faster':
        this.compPartenzaMode = 'slower';
        break;
      case 'slower':
        this.compPartenzaMode = 'faster';
        break;

      default:
        break;
    }
    this.cambioModalita.emit(this.compPartenzaMode);
  }

}
