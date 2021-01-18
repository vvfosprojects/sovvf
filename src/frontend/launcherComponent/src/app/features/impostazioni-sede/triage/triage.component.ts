import { Component, OnInit } from '@angular/core';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

@Component({
    selector: 'app-triage',
    templateUrl: './triage.component.html',
    styleUrls: ['./triage.component.scss']
})
export class TriageComponent implements OnInit {

    tConfig = {
        hasAllCheckBox: false,
        hasFilter: false,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 1000
    } as TreeviewConfig;

    tItems = [
        new TreeviewItem({
            text: 'Ci sono persone in casa?',
            value: 'Ci sono persone in casa?',
            disabled: true,
            children: [
                {
                    text: 'Si',
                    value: 'si',
                    children: [{
                        text: 'Ci sono persone in pericolo?',
                        value: 'Ci sono persone in pericolo?',
                        children: [
                            { text: 'Si', value: 'si', disabled: true },
                            { text: 'No', value: 'no', disabled: true },
                            { text: 'Non lo so', value: 'non lo so', disabled: true }
                        ],
                        disabled: true
                    }],
                    disabled: true
                },
                {
                    text: 'No',
                    value: 'no',
                    children: [{
                        text: 'Si riesce ad accedere all\'abitazione?',
                        value: 'Si riesce ad accedere all\'abitazione?',
                        children: [
                            { text: 'Si', value: 'si', disabled: true },
                            { text: 'No', value: 'no', disabled: true },
                            { text: 'Non lo so', value: 'non lo so', disabled: true }
                        ],
                        disabled: true
                    }],
                    disabled: true
                },
                {
                    text: 'Non lo so',
                    value: 'non lo so',
                    children: [{
                        text: 'Ci sono persone in pericolo?',
                        value: 'Ci sono persone in pericolo?',
                        children: [
                            {
                                text: 'Si',
                                value: 'si',
                                children: [{
                                    text: 'Si riesce ad accedere all\'abitazione?',
                                    value: 'Si riesce ad accedere all\'abitazione?',
                                    children: [
                                        { text: 'Si', value: 'si', disabled: true },
                                        { text: 'No', value: 'no', disabled: true },
                                        { text: 'Non lo so', value: 'non lo so', disabled: true }
                                    ],
                                    disabled: true
                                }],
                                disabled: true
                            },
                            {
                                text: 'No',
                                value: 'no',
                                children: [{
                                    text: 'Si riesce ad accedere all\'abitazione?',
                                    value: 'Si riesce ad accedere all\'abitazione?',
                                    children: [
                                        { text: 'Si', value: 'si', disabled: true },
                                        { text: 'No', value: 'no', disabled: true },
                                        { text: 'Non lo so', value: 'non lo so', disabled: true }
                                    ],
                                    disabled: true
                                }],
                                disabled: true
                            },
                            {
                                text: 'Non lo so',
                                value: 'non lo so',
                                children: [{
                                    text: 'Si riesce ad accedere all\'abitazione?',
                                    value: 'Si riesce ad accedere all\'abitazione?',
                                    children: [
                                        { text: 'Si', value: 'si', disabled: true },
                                        { text: 'No', value: 'no', disabled: true },
                                        { text: 'Non lo so', value: 'non lo so', disabled: true }
                                    ],
                                    disabled: true
                                }],
                                disabled: true
                            }
                        ],
                        disabled: true
                    }],
                    disabled: true
                }
            ]
        })
    ];

    constructor() {
    }

    ngOnInit(): void {
    }

}
