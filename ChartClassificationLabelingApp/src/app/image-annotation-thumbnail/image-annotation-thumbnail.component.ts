import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageAnnotation } from '../models/ImageAnnotation';
import { Chart } from '../models/Chart';
import { chartTypesList } from '../core/ChartTypes';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-image-annotation-thumbnail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-annotation-thumbnail.component.html',
  styleUrls: ['./image-annotation-thumbnail.component.css']
})
export class ImageAnnotationThumbnailComponent implements OnInit{

  @Input() imageAnnotated!: ImageAnnotation;
  chartTypes: Array<Chart> = [];
  @Output() annotated = new EventEmitter<ImageAnnotation>();

  constructor() { }

  ngOnInit(): void {
    this.chartTypes = chartTypesList;
  }

  onSubmit(): void {
    this.annotated.emit(this.imageAnnotated);
  }

  displayImage(): void {
    window.open(this.imageAnnotated.imageUrl, '_blank')?.focus();
  }

}
