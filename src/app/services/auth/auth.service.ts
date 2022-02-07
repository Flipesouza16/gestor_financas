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
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  userCredentials: UserModel;
  observerUser = new Subject();

  constructor(private auth: Auth, private userDataService: UserDataService) {}

  async login(user: UserModel) {
    await signInWithEmailAndPassword(this.auth, user.email, user.password);
    this.observerUser.next(user);
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

    const { value } = await Storage.get({
      key: 'users',
    });

    let users = JSON.parse(value) as any[];
    if(!users) {
      users = [];
    }
    users.push(user);

    await Storage.set({
      key: 'users',
      value: JSON.stringify(users)
    });

    this.observerUser.next(user);
    this.userCredentials = user;
    return this.userDataService.addUser(user);
  }

  getObserverUser() {
    return this.observerUser.asObservable();
  }

  async logout() {
    await Storage.clear();
    return signOut(this.auth);
  }

  getAuth() {
    return this.auth.currentUser;
  }
}
