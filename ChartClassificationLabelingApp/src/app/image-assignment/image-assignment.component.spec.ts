import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAssignmentComponent } from './image-assignment.component';

describe('ImageAssignmentComponent', () => {
  let component: ImageAssignmentComponent;
  let fixture: ComponentFixture<ImageAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ImageAssignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
