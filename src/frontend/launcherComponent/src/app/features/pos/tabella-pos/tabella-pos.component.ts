import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-tabella-pos',
    templateUrl: './tabella-pos.component.html',
    styleUrls: ['./tabella-pos.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabellaPosComponent {

    @Input() page: number;
    @Input() pageSize: number;
    @Input() pageSizes: number[];
    @Input() totalItems: number;
    @Input() loading: boolean;
    @Input() pos: any[];

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() deletePos: EventEmitter<{ idPos: string, descrizionePos: string }> = new EventEmitter<{ idPos: string, descrizionePos: string }>();

    constructor() {
    }

    onDeletePos(idPos: string, descrizionePos: string): void {
        this.deletePos.emit({ idPos, descrizionePos });
    }
}
