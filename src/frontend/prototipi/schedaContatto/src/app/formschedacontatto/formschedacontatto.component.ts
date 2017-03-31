import { Component, OnInit } from '@angular/core';
import { FormschedacontattoModel} from './formschedacontatto.model';

@Component({
  selector: 'app-formschedacontatto',
  templateUrl: './formschedacontatto.component.html',
  styleUrls: ['./formschedacontatto.component.css']
})
export class FormschedacontattoComponent implements OnInit {
fs : FormschedacontattoModel;

  constructor() {
       this.fs = new FormschedacontattoModel(798495);

   }

  ngOnInit() {
  }

}
