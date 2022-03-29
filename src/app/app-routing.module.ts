import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormUserComponent } from './form-user/form-user.component';
const routes: Routes = [
  // { path: '', redirectTo: 'user-component', pathMatch: 'full' },
  {
    path: 'user-component',
    component: FormUserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
