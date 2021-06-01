import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PosInterface } from '../../../shared/interface/pos.interface';

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
    @Input() pos: PosInterface[];

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() download: EventEmitter<PosInterface> = new EventEmitter<PosInterface>();
    @Output() editPos: EventEmitter<PosInterface> = new EventEmitter<PosInterface>();
    @Output() deletePos: EventEmitter<{ idPos: string, descrizionePos: string }> = new EventEmitter<{ idPos: string, descrizionePos: string }>();

    constructor() {
    }

    onDownloadPos(pos: PosInterface): void {
        this.download.emit(pos);
    }

    onEditPos(pos: PosInterface): void {
        this.editPos.emit(pos);
    }

    onDeletePos(idPos: string, descrizionePos: string): void {
        this.deletePos.emit({ idPos, descrizionePos });
    }
}
