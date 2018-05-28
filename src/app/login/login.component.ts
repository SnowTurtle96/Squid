import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
  public username;
  public password;
  public error;

  constructor() {

  }

  ngOnInit() {
  }



  logIn() {
    this.username = this.username.toString();
    this.password = this.password.toString();
    firebase.auth().signInWithEmailAndPassword(this.username, this.password).catch(data => {
      this.error = data;
      console.log(this.error['code']);
    });
  }
}
