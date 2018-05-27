import {Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {PrescenceService} from './prescence.service';
import {SharedService} from "./shared.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None,

})

export class ChatComponent implements OnInit {

  messages: Observable<Message[]>;
  users: Observable<any[]>;
  message;
  messages1: AngularFirestoreCollection<Message>;
  activeUsername;
  displayName;
  loading = true;

  @ViewChild('scrollme') private myScrollContainer: ElementRef;

  constructor(private afs: AngularFirestore, private firebaseAuth: AngularFireAuth, private db: AngularFireDatabase, private prescence: PrescenceService, private shared: SharedService) {
    this.messages1 = this.afs.collection('Messages', ref => ref.orderBy('timestamp'));
    this.messages = this.messages1.valueChanges();

    this.users = db.list('Accounts').valueChanges();
    this.scrollToBottom();
    this.displayName = 'Not Signed In';
    this.message = 'Sign in to send a message';
    this.shared.signedIn.subscribe(UIlog =>{
      console.log(UIlog)
      this.activeUsername = UIlog;
      this.displayName = UIlog;
    })


    firebaseAuth.authState.subscribe(user => {
      if (user) {
        console.log(user);
        this.activeUsername = user.email;
        this.displayName = user.displayName;
        this.message = '';

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

  dropdown(emoticon) {
    console.log(emoticon);
    if (this.message == undefined) {
      this.message = emoticon;
    } else {
      this.message += emoticon;
    }
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

@Pipe({name: 'emoticon'})
export class Emoticon implements PipeTransform {
  transform(value: string): string {
    let transformedMessage = value;
    transformedMessage = transformedMessage.replace(/:\)/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/happy-1.svg">');
    transformedMessage = transformedMessage.replace(/:A/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/angry.svg">');
    transformedMessage = transformedMessage.replace(/:S/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/confused-1.svg">');
    transformedMessage = transformedMessage.replace(/;\)/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/wink.svg">');
    transformedMessage = transformedMessage.replace(/:P/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/confused-1.svg">');
    transformedMessage = transformedMessage.replace(/-_-/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/bored-1.svg">');
    transformedMessage = transformedMessage.replace(/:’\(/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/crying-1.svg">');
    transformedMessage = transformedMessage.replace(/:V/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/embarrassed.svg">');
    transformedMessage = transformedMessage.replace(/:$/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/in-love.svg">');
    transformedMessage = transformedMessage.replace(/:^/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/kissing.svg">');
    transformedMessage = transformedMessage.replace(/:I/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/ill.svg">');
    transformedMessage = transformedMessage.replace(/>:\(/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/nerd.svg">');
    transformedMessage = transformedMessage.replace(/:K/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/mad.svg">');
    transformedMessage = transformedMessage.replace(/:\(/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/unhappy.svg">');
    transformedMessage = transformedMessage.replace(/:N/g, '<img class="emoticonDisplay" src="../../assets/187129-emoticons/svg/ninja.svg">');


    // }


    return transformedMessage;

  }


}
