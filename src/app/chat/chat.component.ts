import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: Observable<Message[]>;
  message;
  username;
  passwordSignup;
  messages1: AngularFirestoreCollection<Message>;
  activeUsername;
  @ViewChild('scrollme') private myScrollContainer: ElementRef;

  constructor(private afs: AngularFirestore, private firebaseAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.messages1 = this.afs.collection('Messages', ref => ref.orderBy('timestamp'));
    this.messages = this.messages1.valueChanges();
    this.scrollToBottom();

    firebaseAuth.authState.subscribe(user => {
      if (user) {
        console.log(user);
        this.activeUsername = user.email;
        this.setStatusToOnline();

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


  sendMessage() {
    console.log('thisisdeway' + firebase.auth().currentUser.email);
    let message = new Message();
    message = {

      username: firebase.auth().currentUser.email,
      body: this.message,
      timestamp: new Date()
    };

    var setDoc = this.afs.collection('/Messages').add(message);
    console.log('message ran');
    this.message = '';
    this.scrollToBottom();

  }


  ngOnInit() {
    this.scrollToBottom();
  }

  returnUser() {
    return firebase.auth().currentUser.email;
  }


  test() {
    console.log(firebase.auth().currentUser.email);
  }


  onKeydown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      // prevent default behavior
      event.preventDefault();
    }

    if (this.message === '') {

    } else {
      this.sendMessage();

    }
  }


  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollToBottom = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }


  setStatusToOnline() {
    let prescence = new Presence();
    prescence = {
      username: this.activeUsername,
      status: 'online'
    };
    console.log("Online status set for " + this.activeUsername)
    this.db.database.ref("Users").child(this.activeUsername).set(prescence)
    // this.messages1.doc(document)
    //   .set({
    //     online: true,
    //   }, {merge: true});
  }
}

class Message {
  username: String;
  body: String;
  timestamp: any;
}

class Presence {
  username: String;
  status: String;
}
