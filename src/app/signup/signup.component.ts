import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public email;
  public passwordSignup;
  public displayName;
  constructor() {
  }

  ngOnInit() {

  }

  signUp() {
    this.email = this.email.toString();
    this.passwordSignup = this.passwordSignup.toString();
    firebase.auth().createUserWithEmailAndPassword(this.email, this.passwordSignup);
  }

}
