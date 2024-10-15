import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataServiceService } from '../core/data-service.service';
import { User } from '../models/User';
import { user } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../core/auth.service';
import { faSignIn } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  public submitted = false;
  faSignIn = faSignIn;
  usersRef!: AngularFireList<User>;
  constructor(private toastr: ToastrService, private auth: AuthService, private dataService: DataServiceService, private formBuilder: FormBuilder, private router: Router, private realtimeDb: AngularFireDatabase) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.minLength(4), Validators.required]],
      password: [
        "",
        [
          Validators.required
        ]
      ]
    });
  }

  get formControl() {
    return this.loginForm.controls;
  }

  onLogin(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      //localStorage.setItem("user-Data", JSON.stringify(this.loginForm.value));
      var username = this.formControl['email'].value
      var password = this.formControl['password'].value
      
      this.dataService.getUser(username, password)
        .then(snap => snap.subscribe(
          {
            next: (users: User[]) => {
              var user = users[0]
              this.auth.logIn(user);
              this.toastr.success(`Redirecting to chart app`, 'Logging in');
              this.router.navigate([`app/${user.id}`]);
            },
            error: error => console.log(error.message)
          }),
          error => this.toastr.error(`${error}`, 'Login')
        );
    }
  }

  getUser(username: string, password: string){
    this.usersRef = this.realtimeDb.list('users',  ref => ref.orderByChild('name').equalTo(username));
    var users: User[] = [];
    this.usersRef.snapshotChanges().subscribe(data => {
      data.forEach(user => {
        let a = user.payload.toJSON();
        if(a != null){
          users.push(a as User);
        }
      })
    })
  }
}
