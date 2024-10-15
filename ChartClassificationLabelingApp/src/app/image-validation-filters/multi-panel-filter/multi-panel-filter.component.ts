import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multi-panel-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multi-panel-filter.component.html'
})
export class MultiPanelFilterComponent implements OnInit {
  
  multiPanel: string = "Any";

  ngOnInit(): void {
  }

  @Output() changed = new EventEmitter<string>();

  onChange(){
    this.changed.emit(this.multiPanel);
  }

}
