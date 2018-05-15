import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {AngularFireDatabase} from 'angularfire2/database';
import {PrescenceService} from '../chat/prescence.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public email;
  public passwordSignup;
  public displayName;

  constructor(private db: AngularFireDatabase, private prescence: PrescenceService) {
  }

  ngOnInit() {

  }

  signUp(email, passwordSignup, displayName) {
    email = email.toString();
    passwordSignup = passwordSignup.toString();
    firebase.auth().createUserWithEmailAndPassword(email, passwordSignup).then(function (user) {
      return user.updateProfile({
        displayName: displayName
      }).catch(function (error) {
        console.log(error);
      });
    });
    this.db.database.ref('Accounts').child(displayName);
    this.prescence.sendStatusToServer(this.prescence.setStatusToOnline(this.email, this.displayName), displayName);

  }

}



