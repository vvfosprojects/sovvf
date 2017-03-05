import { Component, OnInit } from '@angular/core';

import { CompositoreService } from '../compositore/compositore.service';

@Component({
  selector: 'app-compositore',
  templateUrl: './compositore.component.html',
  styleUrls: ['./compositore.component.css']
})
export class CompositoreComponent implements OnInit {

  constructor(private compositoreService: CompositoreService) { }

  ngOnInit() {
  }

  private get mezziInPartenza() {
    return this.compositoreService.mezziInPartenza;
  }

}
