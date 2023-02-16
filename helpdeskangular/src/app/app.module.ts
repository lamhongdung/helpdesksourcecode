import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationModule } from './notification.module';
import { NotificationService } from './service/notification.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { HeaderComponent } from './component/header/header/header.component';
import { UserListComponent } from './component/user/user-list/user-list.component';
import {ReactiveFormsModule} from "@angular/forms";
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    CategoryListComponent,
    HeaderComponent,
    UserListComponent,
    UserCreateComponent,
    TicketListComponent,
    TicketCreateComponent,
    TeamListComponent,
    TeamCreateComponent,
    CalendarListComponent,
    CalendarCreateComponent,
    PriorityListComponent,
    PriorityCreateComponent,
    CategoryCreateComponent,
    UserEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotificationModule,
    ReactiveFormsModule
  ],
  providers: [NotificationService, AuthenticationGuard, AuthenticationService, UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
