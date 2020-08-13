import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-voci-trasferimento-chiamata-per-pagina',
  templateUrl: './voci-trasferimento-chiamata-per-pagina.component.html',
  styleUrls: ['./voci-trasferimento-chiamata-per-pagina.component.css']
})
export class VociTrasferimentoChiamataPerPaginaComponent implements OnInit {


  @Input() pageSize: number;
  @Input() pageSizes: number[];

  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  
  constructor() { }

  ngOnInit() {
  }

  onChangePageSize(pageSize: number) {
    this.pageSizeChange.emit(pageSize);
  }

}
