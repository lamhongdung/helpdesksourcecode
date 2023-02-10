import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { CategoryListComponent } from './category/category-list/category-list.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'category-list', component: CategoryListComponent },
  //  must passed authentication, we just can access 'user/management'
  { path: 'user/management', component: UserComponent, canActivate: [AuthenticationGuard]
  //     data: {
  //       roles: ['ROLE_SUPPORTER','ROLE_ADMIN']
  // } 
},
  
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
