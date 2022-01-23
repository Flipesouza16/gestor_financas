import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth) { }

  login(user: User) {
    return this.angularFireAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  register(user: User) {
    return this.angularFireAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

  logout() {
    return this.angularFireAuth.signOut();
  }

  getAuth() {
    return this.angularFireAuth;
  }
}
