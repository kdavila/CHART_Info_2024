import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean = false;
  user: User = {
    id: 0,
    name: '',
    password: '',
    roles: {
      admin: false,
      annotator: false,
      validator: false
    },
    username: ''
  };
  constructor() { }
  
  logIn(user: User): void {
    this.user = user;
    this.loggedIn = true;
  }

  logOut(): void {
    this.user = {
      id: 0,
      name: '',
      password: '',
      roles: {
        admin: false,
        annotator: false,
        validator: false
      },
      username: ''
    };
    this.loggedIn = false;
  }

  public get getUserLoggedIn() {
    return this.user; 
  }

  isLoggedIn() {
    return this.loggedIn;
  }

}
