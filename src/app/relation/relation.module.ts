import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RelationPageRoutingModule } from './relation-routing.module';

import { RelationPage } from './relation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RelationPageRoutingModule
  ],
  declarations: [RelationPage]
})
export class RelationPageModule {}
