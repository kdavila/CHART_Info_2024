import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAnnotationThumbnailComponent } from './image-annotation-thumbnail.component';

describe('ImageAnnotationThumbnailComponent', () => {
  let component: ImageAnnotationThumbnailComponent;
  let fixture: ComponentFixture<ImageAnnotationThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ImageAnnotationThumbnailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageAnnotationThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
