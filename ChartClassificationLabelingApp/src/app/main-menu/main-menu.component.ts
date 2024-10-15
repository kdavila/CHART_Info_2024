import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageAssignmentComponent } from '../image-assignment/image-assignment.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ImageValidationComponent } from '../image-validation/image-validation.component';
import { ImageAnnotationComponent } from '../image-annotation/image-annotation.component';
import { AuthService } from '../core/auth.service';
import { User } from '../models/User';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule, ImageAnnotationComponent, ImageAssignmentComponent, ImageValidationComponent, NavbarComponent],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  user!: User;
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.user = this.auth.getUserLoggedIn;
    this.assignActive = this.user.roles.admin;
    this.annotateActive = this.user.roles.annotator;
    this.validateActive = this.user.roles.validator;
  }
  //for navbar
  assignActive: boolean = false;
  annotateActive: boolean = false;
  validateActive: boolean = false;
  //for content view
  toggleViewAssign: boolean = false;
  toggleViewAnnotate: boolean = false;
  toggleViewValidate: boolean = false;
}
