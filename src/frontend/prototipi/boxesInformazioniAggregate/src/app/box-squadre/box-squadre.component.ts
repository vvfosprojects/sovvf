import { Component, OnInit, Input } from '@angular/core';
import { SquadreSo } from "app/box-squadre/box-squadre.model";


@Component({
  selector: 'box-squadre',
  templateUrl: './box-squadre.component.html',
  styleUrls: ['./box-squadre.component.css']
})
export class BoxSquadreComponent implements OnInit {

  @Input() squadre: SquadreSo;

  constructor() { }

  ngOnInit() {
  }

}

