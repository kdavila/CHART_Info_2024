import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageValidationComponent } from './image-validation.component';

describe('ImageValidationComponent', () => {
  let component: ImageValidationComponent;
  let fixture: ComponentFixture<ImageValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ImageValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
