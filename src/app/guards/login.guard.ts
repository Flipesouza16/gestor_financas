import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      onAuthStateChanged(this.auth, user => {
        if(user) {
          this.router.navigate(['agenda']);
        }
        resolve(!user ? true : false);
      });
    });
  }
}
