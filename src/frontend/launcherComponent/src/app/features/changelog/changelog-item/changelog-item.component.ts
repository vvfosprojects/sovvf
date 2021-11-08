import { Component, Input } from '@angular/core';
import { ChangelogInterface } from '../../../shared/interface/changelog.interface';
import { LSNAME } from '../../../core/settings/config';

@Component({
    selector: 'app-changelog-item',
    templateUrl: './changelog-item.component.html',
    styleUrls: ['./changelog-item.component.css']
})
export class ChangelogItemComponent {

    @Input() changelog: ChangelogInterface;
    @Input() changelogId: string;
    @Input() ultimoChangelog: boolean;
    @Input() disableIndice: boolean;

    indiceVisible = true;

    emailProblemi = LSNAME.emailError;

    constructor() {
    }

    toggleIndiceVisible(): void {
        this.indiceVisible = !this.indiceVisible;
    }

}
