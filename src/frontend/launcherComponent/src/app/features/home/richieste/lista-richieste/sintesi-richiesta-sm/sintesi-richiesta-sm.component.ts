import { Component, OnInit, Input } from '@angular/core';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

// Model
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Helper methods
import { HelperSintesiRichiesta } from '../../helper/_helper-sintesi-richiesta';

// Ngxs
import { Store } from '@ngxs/store';
import { ClearRichiestaFissata } from '../../../store/actions/richiesta-fissata.actions';

@Component({
  selector: 'app-sintesi-richiesta-sm',
  templateUrl: './sintesi-richiesta-sm.component.html',
  styleUrls: ['./sintesi-richiesta-sm.component.css']
})
export class SintesiRichiestaSmComponent implements OnInit {
  @Input() richiesta: SintesiRichiesta;

  methods = new HelperSintesiRichiesta;

  constructor(private store: Store,
    tooltipConfig: NgbTooltipConfig) {
    tooltipConfig.container = 'body';
    tooltipConfig.placement = 'bottom';
  }

  ngOnInit() {
  }

  // Ritorna la richiesta nella lista, defissandola
  onDefissa() {
    this.store.dispatch(new ClearRichiestaFissata());
  }
}
