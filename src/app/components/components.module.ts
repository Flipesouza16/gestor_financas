import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendaCardComponent } from './agenda-card/agenda-card.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';

@NgModule({
  declarations: [AgendaCardComponent, RegistrationFormComponent],
  imports: [IonicModule, CommonModule, FormsModule],
  exports: [AgendaCardComponent, RegistrationFormComponent],
})
export class ComponentsModule {}
