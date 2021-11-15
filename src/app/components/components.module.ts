import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendaCardComponent } from './agenda-card/agenda-card.component';

@NgModule({
  declarations: [AgendaCardComponent],
  imports: [IonicModule, CommonModule, FormsModule],
  exports: [AgendaCardComponent],
})
export class ComponentsModule {}
