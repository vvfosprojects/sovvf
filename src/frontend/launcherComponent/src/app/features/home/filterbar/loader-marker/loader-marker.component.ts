import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader-marker',
  templateUrl: './loader-marker.component.html',
  styleUrls: ['./loader-marker.component.css']
})
export class LoaderMarkerComponent implements OnInit {

  @Input() markerOnLoading: boolean;

  constructor() { }

  ngOnInit() {
  }

}
