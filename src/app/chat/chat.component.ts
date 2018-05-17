import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {PrescenceService} from './prescence.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  messages: Observable<Message[]>;
  users: Observable<any[]>;
  message;
  messages1: AngularFirestoreCollection<Message>;
  activeUsername;
  displayName;

  @ViewChild('scrollme') private myScrollContainer: ElementRef;

  constructor(private afs: AngularFirestore, private firebaseAuth: AngularFireAuth, private db: AngularFireDatabase, private prescence: PrescenceService) {
    this.messages1 = this.afs.collection('Messages', ref => ref.orderBy('timestamp'));
    this.messages = this.messages1.valueChanges();

    this.users = db.list('Accounts').valueChanges();
    this.scrollToBottom();

    firebaseAuth.authState.subscribe(user => {
      if (user) {
        console.log(user);
        this.activeUsername = user.email;
        this.displayName = user.displayName;

        this.prescence.setStatusToOnline(this.activeUsername, this.displayName);
        this.prescence.updateOnDisconnect(this.activeUsername, this.displayName);
        this.prescence.updateOnIdle(this.activeUsername, this.displayName);

        //TODO
        // this.updateOnIdle();

      } else {
        this.activeUsername = 'Not logged in';
      }
    });


    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        console.log(user.displayName + 'logged in');

        this.activeUsername = user.email;
        this.activeUsername = firebase.auth().currentUser.email;

      } else {
        console.log('Users signed out');
        this.activeUsername = 'Not logged in';

      }
    });
  }





  sendMessage() {
    let message = new Message();
    message = {

      username: firebase.auth().currentUser.displayName,
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
}


class Message {
  username: String;
  body: String;
  timestamp: any;
}

class Presence {
  username: String;
  status: String;
  displayname: String;
}

class Account {
  status: String;
  username: String;
}
