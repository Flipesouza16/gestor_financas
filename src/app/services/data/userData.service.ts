import { Injectable } from '@angular/core';
import { collectionData, collection, doc, docData, Firestore, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Storage } from '@capacitor/storage';
import { Observable, Subject } from 'rxjs';
import { UserModel } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})

export class UserDataService {

  constructor(private firestore: Firestore) { }

  async getCurrentUserByStorage() {
    const { value: user } = await Storage.get({
      key: 'user-logged'
    });

    if(user !== 'undefined') {
      console.log('user: ',user);
      return JSON.parse(user);
    } else {
      return;
    }
  }

  getUsers() {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' }) as Observable<UserModel[]>;
  }

  getUserById(id): Observable<UserModel> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return docData(userDocRef, { idField: 'id' }) as Observable<UserModel>;
  }

  addUser(user: UserModel) {
    const notesRef = collection(this.firestore, 'users');
    return addDoc(notesRef, user);
  }

  deleteUser(user: UserModel) {
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return deleteDoc(userDocRef);
  }

  updateUser(user: UserModel) {
    console.log('update user: ',user);

    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return updateDoc(userDocRef, { ...user, purchases: user.purchases });
  }
}
