import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'src/app/models/Chart';
import { chartTypesList } from 'src/app/core/ChartTypes';

@Component({
  selector: 'app-chart-type-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chart-type-filter.component.html'
})
export class ChartTypeFilterComponent implements OnInit{

  chartTypes: Array<Chart> = []; 
  @Input() chartFilter: string = "Any";

  ngOnInit(): void {
    this.chartTypes = chartTypesList;
  }

  @Output() changed = new EventEmitter<string>();

  onChange(){
    this.changed.emit(this.chartFilter);
  }
}
