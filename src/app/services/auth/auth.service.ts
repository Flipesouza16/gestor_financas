import { Injectable } from '@angular/core';
import { UserModel } from 'src/app/interfaces/user';
import { Auth } from '@angular/fire/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { UserDataService } from '../data/userData.service';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  userCredentials: UserModel;

  constructor(private auth: Auth, private userDataService: UserDataService) {}

  async login(user: UserModel) {
    await signInWithEmailAndPassword(this.auth, user.email, user.password);
    this.userCredentials = user;
  }

  async saveAndLoadCurrentUsersPurchases(userLogged: UserModel) {
    await Storage.set({
      key: 'user-logged',
      value: JSON.stringify(userLogged),
    });

    if(userLogged?.purchases?.length) {
      await Storage.set({
        key: 'list-purchases-by-month',
        value: userLogged.purchases,
      });
    }
  }

  async register(user: UserModel) {
    await createUserWithEmailAndPassword(this.auth, user.email, user.password);
    this.userCredentials = user;
    return this.userDataService.addUser(user);
  }

  async logout() {
    await Storage.clear();
    return signOut(this.auth);
  }

  getAuth() {
    return this.auth.currentUser;
  }
}
