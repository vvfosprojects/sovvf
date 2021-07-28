import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    OnChanges,
    SimpleChanges
} from '@angular/core';

@Component({
    selector: 'app-tasto-chiamata-mappa',
    templateUrl: './tasto-chiamata-mappa.component.html',
    styleUrls: ['./tasto-chiamata-mappa.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TastoChiamataMappaComponent implements OnChanges {

    @HostBinding('class') classes = 'btn-group';

    @Input() active: boolean;
    @Input() disabled: boolean;

    @Output() toggleChiamataFromMappa: EventEmitter<any> = new EventEmitter<any>();

    defaultColorButtonChiamata: string;

    constructor(private cd: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.active?.currentValue) {
            this.cd.detectChanges();
        }
    }

    onActiveChiamataFromMappa(): void {
        this.toggleChiamataFromMappa.emit();
    }
}
