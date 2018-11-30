import { Component, OnInit, Input } from '@angular/core';

// Model
import { MezzoComposizione } from '../../model/mezzo-composizione.model';

// Service
import { CompMezzoSquadraService } from '../../service/comp-mezzo-squadra/comp-mezzo-squadra.service';
import { Mezzo } from 'src/app/shared/model/mezzo.model';

@Component({
  selector: 'app-mezzo-composizione',
  templateUrl: './mezzo-composizione.component.html',
  styleUrls: ['./mezzo-composizione.component.css']
})
export class MezzoComposizioneComponent implements OnInit {
  @Input() mezzoComp: MezzoComposizione;

  mezzoSelezionato: MezzoComposizione;
  hover = false;

  constructor(private compMezzoSquadra: CompMezzoSquadraService) {
    this.compMezzoSquadra.getMezzo().subscribe(mezzo => {
      this.mezzoSelezionato = mezzo;
    });
  }

  ngOnInit() {
  }

  click(mezzo) {
    if (!this.mezzoSelezionato) {
      this.compMezzoSquadra.setMezzo(mezzo);
    } else if (this.mezzoSelezionato !== mezzo) {
      this.compMezzoSquadra.clearMezzo();
      this.compMezzoSquadra.setMezzo(mezzo);
    } else if (this.mezzoSelezionato === mezzo) {
      this.compMezzoSquadra.clearMezzo();
    }
  }

  hoverIn() {
    this.hover = true;
  }

  hoverOut() {
    this.hover = false;
  }

  // NgClass
  mezzoCompClass() {
    return {
      'bg-light': this.hover,
      'bg-light border-danger': this.mezzoComp === this.mezzoSelezionato
    };
  }
}
