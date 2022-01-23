import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      this.authService.getAuth().onAuthStateChanged(user => {
        console.log('user: ',user);

        if(!user) {
          this.router.navigate(['login']);
        }
        resolve(user ? true : false);
      });
    });
  }
}
