import { Component, OnInit, Input } from '@angular/core';
import { PreAccoppiato } from '../../model/pre-accoppiato.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Input() preAccoppiatiSelezionati: PreAccoppiato[];
  
  constructor() { }

  ngOnInit() {
  }

}
