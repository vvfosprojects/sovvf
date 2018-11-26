import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PreAccoppiato } from '../../model/pre-accoppiato.model';
import { PartenzaService } from '../../service/partenza/partenza.service';

@Component({
  selector: 'app-nav-faster',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavFasterComponent implements OnInit {
  @Input() preAccoppiatiSelezionati: PreAccoppiato[];
  @Output() cambioModalita: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  changeViewMode(newViewMode){
    this.cambioModalita.emit(newViewMode);
  }
}
