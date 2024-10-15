import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-has-charts-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './has-charts-filter.component.html'
})
export class HasChartsFilterComponent {
  hasCharts: string = "Any";

  ngOnInit(): void {
  }

  @Output() changed = new EventEmitter<string>();

  onChange(){
    this.changed.emit(this.hasCharts);
  }
}
