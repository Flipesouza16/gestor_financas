import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private auth: Auth) {}

  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      onAuthStateChanged(this.auth, (user) => {
        if(!user) {
          this.router.navigate(['login']);
        }
        resolve(user ? true : false);
      });
    });
  }
}
