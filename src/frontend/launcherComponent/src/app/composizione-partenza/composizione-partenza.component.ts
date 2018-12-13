import { Component, OnInit, Input } from '@angular/core';
import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';
import { PartenzaService } from './service/partenza/partenza.service';

@Component({
  selector: 'app-composizione-partenza',
  templateUrl: './composizione-partenza.component.html',
  styleUrls: ['./composizione-partenza.component.css']
})
export class ComposizionePartenzaComponent implements OnInit {
  @Input() richiesta: SintesiRichiesta;
  compPartenzaMode = 'faster';

  constructor(public partenzaS: PartenzaService) {
    this.compPartenzaMode = this.partenzaS.compPartenzaModeIniziale;
    this.partenzaS.getCompPartenzaMode().subscribe(viewMode => {
      this.compPartenzaMode = viewMode;
    });
  }

  ngOnInit() {
  }

  dismissPartenza() {
    this.partenzaS.dismissPartenza();
  }

  CardClasses(r) {
    return;
  }

}
