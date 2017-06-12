import { Component, OnInit } from '@angular/core';
import {TreeModule,TreeNode} from 'primeng/primeng';
import {GrowlModule,Message} from 'primeng/primeng';
import { GestionePermessiFakeService } from "./gestione-permessi-fake.service";

@Component({
  selector: 'app-gestionepermessi',
  templateUrl: './gestionepermessi.component.html',
  styleUrls: ['./gestionepermessi.component.css']
})
export class GestionepermessiComponent implements OnInit {

  files: TreeNode[];
  selectedFile: TreeNode;

  constructor(private gestionePermessiService: GestionePermessiFakeService) { }

  ngOnInit() {
    this.gestionePermessiService.getFiles().then(files => this.files = files);
  }

}
