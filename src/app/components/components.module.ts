import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendaCardComponent } from './agenda-card/agenda-card.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { ListOfWhoIsBuyingComponent } from './list-of-who-is-buying/list-of-who-is-buying.component';
import { LoginRegisterComponent } from './LoginRegister/login-register/login-register.component';
@NgModule({
  declarations: [AgendaCardComponent, RegistrationFormComponent, ListOfWhoIsBuyingComponent, LoginRegisterComponent],
  imports: [IonicModule, CommonModule, FormsModule],
  exports: [AgendaCardComponent, RegistrationFormComponent, ListOfWhoIsBuyingComponent, LoginRegisterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
