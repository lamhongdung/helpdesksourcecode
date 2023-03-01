import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './guard/authentication.guard';
import { UserListComponent } from './component/user/user-list/user-list.component';
import { CategoryListComponent } from './component/category/category-list/category-list.component';
import { UserCreateComponent } from './component/user/user-create/user-create.component';
import { TicketListComponent } from './component/ticket/ticket-list/ticket-list.component';
import { TicketCreateComponent } from './component/ticket/ticket-create/ticket-create.component';
import { TeamListComponent } from './component/team/team-list/team-list.component';
import { TeamCreateComponent } from './component/team/team-create/team-create.component';
import { CalendarListComponent } from './component/calendar/calendar-list/calendar-list.component';
import { CalendarCreateComponent } from './component/calendar/calendar-create/calendar-create.component';
import { PriorityListComponent } from './component/priority/priority-list/priority-list.component';
import { PriorityCreateComponent } from './component/priority/priority-create/priority-create.component';
import { CategoryCreateComponent } from './component/category/category-create/category-create.component';
import { UserEditComponent } from './component/user/user-edit/user-edit.component';
import { UserViewComponent } from './component/user/user-view/user-view.component';
import { LoginComponent } from './component/login/login.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { EditProfileComponent } from './component/edit-profile/edit-profile.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // login
  { path: 'login', component: LoginComponent },
  // reset password
  { path: 'reset-password', component: ResetPasswordComponent },
  // edit profile
  {
    path: 'edit-profile/:id', component: EditProfileComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_CUSTOMER', 'ROLE_SUPPORTER', 'ROLE_ADMIN']
    }
  },
  // change password
  {
    path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_CUSTOMER', 'ROLE_SUPPORTER', 'ROLE_ADMIN']
    }
  },
  // User menu 
  {
    path: 'user-list', component: UserListComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'user-create', component: UserCreateComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'user-edit/:id', component: UserEditComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'user-view/:id', component: UserViewComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  // Category menu
  {
    path: 'category-list', component: CategoryListComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'category-create', component: CategoryCreateComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  // Team menu
  {
    path: 'team-list', component: TeamListComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'team-create', component: TeamCreateComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  // Calendar menu
  {
    path: 'calendar-list', component: CalendarListComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'calendar-create', component: CalendarCreateComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  // Priority menu
  {
    path: 'priority-list', component: PriorityListComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'priority-create', component: PriorityCreateComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'ticket-list', component: TicketListComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_CUSTOMER', 'ROLE_SUPPORTER', 'ROLE_ADMIN']
    }
  },
  {
    path: 'ticket-create', component: TicketCreateComponent, canActivate: [AuthenticationGuard],
    data: {
      roles: ['ROLE_CUSTOMER', 'ROLE_SUPPORTER', 'ROLE_ADMIN']
    }
  },
  // if paths are not in the above list then redirects to path '/users-list'
  { path: '**', redirectTo: '/ticket-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
