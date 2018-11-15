import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { UnitaOperativaTreeviewService } from '../navbar-service/unita-operativa-treeview-service/unita-operativa-treeview.service';
import { TreeviewConfig, TreeviewItem, DropdownTreeviewComponent } from 'ngx-treeview';

@Component({
    selector: 'app-unita-operativa-treeview',
    templateUrl: './unita-operativa-treeview.component.html',
    styleUrls: ['./unita-operativa-treeview.component.css']
})
export class UnitaOperativaTreeviewComponent implements OnInit {

    items: TreeviewItem[];
    initItem: any;
    selectedItem: any;
    countOpen = 0;

    config = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 400
    });

    constructor(private treeviewService: UnitaOperativaTreeviewService) {
    }

    @ViewChild(DropdownTreeviewComponent) dropdownTreeviewComponent: DropdownTreeviewComponent;

    @HostListener('document:keydown.escape') onKeydownHandler() {
        this.cambioSede();
    }

    ngOnInit() {
        this.treeviewService.getBooks().subscribe( r => {
            this.items = r;
        });
    }


    onSelectedChange(value: string) {
        if (!this.initItem) {
            this.initItem = value;
        } else {
            this.countOpen++;
            this.selectedItem = value;
        }
        console.log('Sedi selezionate: ', value);
    }

    cambioSede() {
        if (this.initItem !== this.selectedItem && this.countOpen > 0) {
            console.log('La sede è cambiata!');
            this.initItem = this.selectedItem;
        }
    }

    annullaCambioSede() {
        console.log('premuto tasto esce');
    }

}
