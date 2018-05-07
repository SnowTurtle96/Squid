import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

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
      } else {
        this.activeUsername = 'Not logged in';
      }
    });

    // firebase.firestore().collection().doc('hi');
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

    let prescence = new Presence();
    prescence = {
      username: this.activeUsername,
      status: 'online'
    };


    // db.list("Users").push(prescence)

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


  prescence() {
    // Fetch the current user's ID from Firebase Authentication.
    var uid = firebase.auth().currentUser.uid;

// Create a reference to this user's specific status node.
// This is where we will store data about being online/offline.
    var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

// We'll create two constants which we will write to
// the Realtime database when this device is offline
// or online.
    var isOfflineForDatabase = {
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    var isOnlineForDatabase = {
      state: 'online',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

// Create a reference to the special '.info/connected' path in
// Realtime Database. This path returns `true` when connected
// and `false` when disconnected.
    firebase.database().ref('.info/connected').on('value', function (snapshot) {
      // If we're not currently connected, don't do anything.
      if (snapshot.val() == false) {
        return;
      }
      // If we are currently connected, then use the 'onDisconnect()'
      // method to add a set which will only trigger once this
      // client has disconnected by closing the app,
      // losing internet, or any other means.
      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
        // The promise returned from .onDisconnect().set() will
        // resolve as soon as the server acknowledges the onDisconnect()
        // request, NOT once we've actually disconnected:
        // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

        // We can now safely set ourselves as 'online' knowing that the
        // server will mark us as offline once we lose connection.
        userStatusDatabaseRef.set(isOnlineForDatabase);
      });
    });
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
