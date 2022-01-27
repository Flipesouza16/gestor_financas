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

  observerUsers = new Subject();

  constructor(private auth: Auth, private userDataService: UserDataService) {}

  async login(user: UserModel) {
    await signInWithEmailAndPassword(this.auth, user.email, user.password);
    this.saveAndLoadCurrentUsersPurchases(user);
  }

  saveAndLoadCurrentUsersPurchases(user: UserModel) {
    this.userDataService.getUsers().subscribe(async (users: UserModel[]) => {
      const userLogged: UserModel = users.filter(
        (userRegistered) => userRegistered.email === user.email
      )[0] as UserModel;

      console.log('apos fazer login: ',userLogged);

      await Storage.set({
        key: 'user-logged',
        value: JSON.stringify(userLogged),
      });

      await Storage.set({
        key: 'list-purchases-by-month',
        value: userLogged.purchases,
      });

      this.observerUsers.next(userLogged);
    });
  }

  getObserverUser() {
    return this.observerUsers.asObservable();
  }

  async register(user: UserModel) {
    await createUserWithEmailAndPassword(this.auth, user.email, user.password);
    return this.userDataService.addUser(user);
  }

  async logout() {
    return await signOut(this.auth);
  }

  getAuth() {
    return this.auth.currentUser;
  }
}
