import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelationPage } from './relation.page';

const routes: Routes = [
  {
    path: '',
    component: RelationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelationPageRoutingModule {}
