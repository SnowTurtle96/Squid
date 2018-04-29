import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public activeUsername;
  public loginFormState = false;
  public loginText = 'Already have an account?';

  constructor(private firebaseAuth: AngularFireAuth) {
    firebaseAuth.authState.subscribe(user => {
      if (user) {
        console.log(user);
        this.activeUsername = user.email;
      } else {
        this.activeUsername = 'Not logged in';
      }
    });

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        console.log(user.email + 'logged in');
        console.log(user.uid + 'logged in');

        this.activeUsername = user.email;
        this.activeUsername = firebase.auth().currentUser.email;


      } else {
        console.log('Users signed out');
        this.activeUsername = 'Not logged in';
      }
    });
  }

  ngOnInit() {
  }

  swapLogin() {
    if (this.loginFormState === true) {
      this.loginFormState = false;
      this.loginText = 'Already have an account?"';
    }
    else {
      this.loginFormState = true;
      this.loginText = 'Need an account?';

    }
  }

  logout() {
    firebase.auth().signOut();
  }

}
