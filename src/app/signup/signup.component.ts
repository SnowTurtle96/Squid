import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {AngularFireDatabase} from 'angularfire2/database';
import {PrescenceService} from '../chat/prescence.service';
import {PrescenceSharedService} from '../chat/prescence-shared.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  providers: [PrescenceSharedService],
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public email;
  public passwordSignup;
  public displayName;
  public errorMessage;

  constructor(private db: AngularFireDatabase, private prescence: PrescenceService) {
  }

  ngOnInit() {

  }

  signUp(email, passwordSignup, displayName) {
    email = email.toString();
    passwordSignup = passwordSignup.toString();
    firebase.auth().createUserWithEmailAndPassword(email, passwordSignup).catch( (err: firebase.FirebaseError) => {
      console.log("Issue with sign in!" + err);
      this.errorMessage = err;
    }).then(function (user) {
      return user.updateProfile({
        displayName: displayName
      }).catch( (err: firebase.FirebaseError) => {
        console.log("Issue with sign in!" + err);
        this.errorMessage = err;
      });
    });
    this.db.database.ref('Accounts').child(displayName);
    this.prescence.sendStatusToServer(this.prescence.setStatusToOnline(this.email, this.displayName), displayName);

  }

}



