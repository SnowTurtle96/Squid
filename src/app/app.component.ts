import {Component, ElementRef, ViewChild} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "angularfire2/firestore";
import * as admin from 'firebase-admin';
import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('scrollme') private myScrollContainer: ElementRef;

  title = 'app';
  serviceAccount = require('../admin/admin.json');
  messages: Observable<Message[]>;
  message;
  username;
  messages1: AngularFirestoreCollection<Message>;
  activeUsername;
  constructor(private afs: AngularFirestore) {
    this.messages1 = this.afs.collection('Messages', ref => ref.orderBy('timestamp'));
    this.messages = this.messages1.valueChanges();
    console.log(this.messages1)
    this.scrollToBottom();


  }


  sendMessage() {

    let message = new Message();
    message = {

      username: this.activeUsername,
      body: this.message,
      timestamp: new Date()

    }


    var setDoc = this.afs.collection("/Messages").add(message)
    console.log("message ran")
    this.message = '';
    this.scrollToBottom()

  }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  setActiveUser(){
    this.activeUsername = this.username

}


  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollToBottom = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}

class Message{
  username: String;
  body: String;
  timestamp: any;
}

