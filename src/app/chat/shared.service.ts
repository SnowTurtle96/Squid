import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";

@Injectable()
export class SharedService {

  public signedIn = new Subject<string>();

  constructor() { }

  updateOnlineStatus(){
    this.signedIn.next('Not Signed In');
  }

}
