import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageValidationThumbnailComponent } from './image-validation-thumbnail.component';

describe('ImageValidationThumbnailComponent', () => {
  let component: ImageValidationThumbnailComponent;
  let fixture: ComponentFixture<ImageValidationThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ImageValidationThumbnailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageValidationThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
