import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

@Component({
  selector: 'app-sganciamento-mezzo-modal',
  templateUrl: './sganciamento-mezzo-modal.component.html',
  styleUrls: ['./sganciamento-mezzo-modal.component.css']
})
export class SganciamentoMezzoModalComponent implements OnInit {

  @Input() icona: any;
  @Input() titolo: string;
  @Input() bottoni: any[];
  @Input() richiestaDa: SintesiRichiesta;
  @Input() idDaSganciare = '';

  constructor(public modal: NgbActiveModal) {
  }

  ngOnInit() {
  }

}
