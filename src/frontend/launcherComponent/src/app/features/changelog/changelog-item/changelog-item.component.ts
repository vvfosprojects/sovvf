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
    @Input() ultimoChangelog: boolean;

    emailProblemi = LSNAME.emailError;

    constructor() {
    }

    ngOnInit() {
    }

}
