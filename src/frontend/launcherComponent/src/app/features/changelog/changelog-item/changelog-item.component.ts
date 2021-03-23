import { Component, Input, OnInit } from '@angular/core';
import { ChangelogInterface } from '../../../shared/interface/changelog.interface';
import { LSNAME } from '../../../core/settings/config';

@Component({
    selector: 'app-changelog-item',
    templateUrl: './changelog-item.component.html',
    styleUrls: ['./changelog-item.component.css']
})
export class ChangelogItemComponent implements OnInit {

    @Input() changelog: ChangelogInterface;
    @Input() changelogId: string;
    @Input() ultimoChangelog: boolean;
    @Input() disableIndice: boolean;
    @Input() nightMode: boolean;

    indiceVisible = true;

    emailProblemi = LSNAME.emailError;

    constructor() {
    }

    ngOnInit(): void {
    }

    onNightMode(): string {
      let value = '';
      if (!this.nightMode) {
        value = '';
      } else if (this.nightMode) {
        value = 'moon-text bg-moon-light';
      }
      return value;
    }

    toggleIndiceVisible(): void {
        this.indiceVisible = !this.indiceVisible;
    }

}
