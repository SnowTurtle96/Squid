import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {Observable} from "rxjs/Observable";
import {environment} from "../environments/environment";
import {AngularFireModule} from "angularfire2";
import {AngularFirestore, AngularFirestoreModule} from "angularfire2/firestore";
import {AngularFireDatabase, AngularFireDatabaseModule} from "angularfire2/database";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule


  ],
  providers: [AngularFireDatabaseModule, AngularFireDatabase],
  bootstrap: [AppComponent]
})
export class AppModule {
  items: Observable<any[]>;
  constructor(db: AngularFirestore) {
    this.items = db.collection('items').valueChanges();
  }
}
