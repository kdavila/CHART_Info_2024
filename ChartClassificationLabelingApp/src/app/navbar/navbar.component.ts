import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket  } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private toastr: ToastrService, private auth: AuthService, private router: Router) { }

  @Input() assignActive!: boolean;
  @Input() annotateActive!: boolean;
  @Input() validateActive!: boolean;
  
  @Output() assignClick = new EventEmitter<boolean>();
  @Output() annotateClick = new EventEmitter<boolean>();
  @Output() validateClick = new EventEmitter<boolean>();

  ngOnInit(): void {
  }

  showAssignation(){
    document.getElementById('assignLink')?.classList.add('active');
    document.getElementById('annotateLink')?.classList.remove('active');
    document.getElementById('validateLink')?.classList.remove('active');
    this.assignClick.emit(true);
  }

  showAnnotation(){
    document.getElementById('annotateLink')?.classList.add('active');
    document.getElementById('assignLink')?.classList.remove('active');
    document.getElementById('validateLink')?.classList.remove('active');
    this.annotateClick.emit(true);
  }

  showValidation(){
    document.getElementById('assignLink')?.classList.remove('active');
    document.getElementById('annotateLink')?.classList.remove('active');
    document.getElementById('validateLink')?.classList.add('active');
    this.validateClick.emit(true);
  }

  logOut(): void{
    this.auth.logOut();
    this.toastr.success(`Goodbye`, 'Logging Out');
    this.router.navigate([`login`]);
  }

  faRightFromBracket = faRightFromBracket;
}
