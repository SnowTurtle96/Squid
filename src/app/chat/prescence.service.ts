import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class PrescenceService {

  mouseEvents: Subscription;
  timer: Subscription;

  constructor(private db: AngularFireDatabase) {
  }


  setStatusToOffline(activeUsername, displayName): Presence {
    let prescence = new Presence();
    prescence = {
      username: activeUsername,
      status: 'offline',
      displayname: displayName
    };
    return prescence;

  }

  setStatusToAway(activeUsername, displayName): Presence {
    let prescence = new Presence();
    prescence = {
      username: activeUsername,
      status: 'away',
      displayname: displayName
    };
    return prescence;

  }

  sendStatusToServer(prescence, displayname) {
    this.db.database.ref('Accounts').child(displayname)
      .set(prescence);
  }

  setStatusToOnline1(activeUsername, displayName) {
    let prescence = new Presence();
    prescence = {
      username: activeUsername,
      status: 'online',
      displayname: displayName

    };
    return prescence;
  }

  setStatusToOnline(activeUsername, displayName) {
    let prescence = new Presence();
    prescence = {
      username: activeUsername,
      status: 'online',
      displayname: displayName

    };

    console.log('Online status set for ' + activeUsername);
    this.db.database.ref('Accounts').child(displayName).set(prescence);
  }

  updateOnDisconnect(activeUsername, displayName) {

    this.db.database.ref('Accounts').child(displayName)
      .onDisconnect()
      .set(this.setStatusToOffline(activeUsername, displayName));
  }

  updateOnIdle(activeUsername, displayName) {
    this.mouseEvents = Observable
      .fromEvent(document, 'mousemove')
      .throttleTime(2000)
      .subscribe(() => {
        this.sendStatusToServer(this.setStatusToOnline1(activeUsername, displayName), displayName);
        this.resetTimer(activeUsername, displayName);
      });
  }

  /// Reset the timer
  resetTimer(activeUsername, displayName) {
    if (this.timer) this.timer.unsubscribe();
    this.timer = Observable.timer(100000)
      .subscribe(() => {
        this.sendStatusToServer(this.setStatusToAway(activeUsername, displayName), displayName);
      });
  }
}

class Presence {
  username: String;
  status: String;
  displayname: String;
}
