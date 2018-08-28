import { Component, OnInit, Input } from '@angular/core';
import { BoxMezzi } from './box-mezzi.model';

@Component({
  selector: 'app-box-mezzi',
  templateUrl: './box-mezzi.component.html',
  styleUrls: ['./box-mezzi.component.css']
})
export class BoxMezziComponent implements OnInit {
  @Input() mezzi: BoxMezzi;
  constructor() { }

  ngOnInit() {
    console.log(this.mezzi);
  }

}
