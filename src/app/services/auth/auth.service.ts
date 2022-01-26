import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/interfaces/user';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  async login(user: User) {
    return await signInWithEmailAndPassword(this.auth, user.email, user.password);
  }

  async register(user: User) {
    return await createUserWithEmailAndPassword(this.auth, user.email, user.password);
  }

  async logout() {
    return await signOut(this.auth);
  }

  getAuth() {
    return this.auth.currentUser;
  }
}
