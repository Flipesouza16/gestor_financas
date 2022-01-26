import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'agenda',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/agenda/agenda.module').then((m) => m.AgendaPageModule),
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: () => import('./pages/login/login/login.module').then( m => m.LoginPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
