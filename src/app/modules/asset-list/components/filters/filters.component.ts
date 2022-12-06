import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'table-filters',
    templateUrl: './filters.component.html'
})

export class TableFiltersComponent implements OnInit {
    
    @Input() filters: any[] = [];   // we can create filter model here, but for the interest of time I'm using any.
    @Output() onMainFilterChnage: EventEmitter<number> = new EventEmitter();
    @Output() onSubFilterChnage: EventEmitter<any> = new EventEmitter();
    activeIndex: number = 0;
    constructor() { }

    ngOnInit() { }

    applyMainFilters() {
        this.onMainFilterChnage.emit(this.activeIndex);
    }

    applySubFilters(checked: boolean, subFilter: string) {
        this.onSubFilterChnage.emit({checked, subFilter});
    }
}