import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {Observable} from 'rxjs/Observable';
import {environment} from '../environments/environment';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestore, AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireDatabase, AngularFireDatabaseModule} from 'angularfire2/database';
import {SignupComponent} from './signup/signup.component';
import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat/chat.component';
import {AngularFireAuth} from 'angularfire2/auth';
import {NavbarComponent} from './navbar/navbar.component';
import {LoginComponent} from './login/login.component';


const appRoutes: Routes = [
  {path: 'signup', component: SignupComponent},
  {path: 'chat', component: ChatComponent}
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    ChatComponent,
    NavbarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    ),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,



  ],
  providers: [AngularFireDatabaseModule, AngularFireDatabase, AngularFireAuth],
  bootstrap: [AppComponent]
})
export class AppModule {
  items: Observable<any[]>;
  constructor(db: AngularFirestore) {
    this.items = db.collection('items').valueChanges();
  }
}
