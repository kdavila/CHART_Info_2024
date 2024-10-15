import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageValidation } from '../models/ImageValidation';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-validation-thumbnail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-validation-thumbnail.component.html',
  styleUrls: ['./image-validation-thumbnail.component.css']
})
export class ImageValidationThumbnailComponent implements OnInit {
  @Input() imagesTopRow: Array<ImageValidation> = [];
  @Input() imagesBottomRow: Array<ImageValidation> = [];
  @Output() imagesAccepted = new EventEmitter<ImageValidation[]>();
  @Output() imagesRejected = new EventEmitter<ImageValidation[]>();

  ngOnInit():void {}

  acceptSelectedImages(): void {
    if (this.imagesTopRow.length == 0 && this.imagesBottomRow.length == 0){
      return;
    }
    this.imagesAccepted
      .emit(this.imagesTopRow
      .filter(image => image.selected)
      .concat(this.imagesBottomRow.filter(image => image.selected)));
  }

  rejectSelectedImages(): void {
    if (this.imagesTopRow.length == 0 && this.imagesBottomRow.length == 0){
      return;
    }
    this.imagesRejected
      .emit(this.imagesTopRow
      .filter(image => image.selected)
      .concat(this.imagesBottomRow.filter(image => image.selected)));
  }

  selectAllImages(): void {
    this.imagesTopRow.forEach(element => {
      element.selected = true;
    });
    this.imagesBottomRow.forEach(element => {
      element.selected = true;
    });
  }

  clear(): void {
    this.imagesTopRow.forEach(element => {
      element.selected = false;
    });
    this.imagesBottomRow.forEach(element => {
      element.selected = false;
    });
  }

  selectImage(image: ImageValidation): void {
    image.selected = !image.selected
  }

  displayImage(image: ImageValidation): void {
    window.open(image.imageUrl, '_blank')?.focus();
  }
}
