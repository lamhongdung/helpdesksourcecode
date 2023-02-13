import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { User } from '../entity/user';
import { NotificationType } from '../enum/notification-type.enum';
import { HeaderType } from '../enum/header-type.enum';
import { ShareService } from '../service/share.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public showLoading: boolean;

  // use to unsubcribe all subcribes easily
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, 
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private shareService: ShareService) {}

  // this method is run right after component's constuctor has just finished
  ngOnInit(): void {

    // if user already logged in before then navigate to '/user/management'(absoluate path)
    if (this.authenticationService.isUserLoggedIn()) {

      // this.router.navigateByUrl('/category-list');
      this.router.navigateByUrl('/ticket-list');

    } else {

      // navigate to the "/login" page
      this.router.navigateByUrl('/login');
      
    }
  }

  // when user click on the "Login" button
  public onLogin(user: User): void {

    // allow to show spinner(circle)
    this.showLoading = true;

    // push into subscriptions[] for easy manage subscriptions.
    // when this component is to be destroy then unsubscribe all these subscriptions
    this.subscriptions.push(

      // get data from server
      this.authenticationService.login(user).subscribe(

        // login success.
        // return: User and token
        (response: HttpResponse<User>) => {

          // get token from the header response
          const token = response.headers.get(HeaderType.JWT_TOKEN);

          // save token value into Local Storage
          // this.authenticationService.saveToken(token);
          this.authenticationService.saveTokenToLocalStorage(token);

          // save user into Local Storage
          // this.authenticationService.addUserToLocalCache(response.body);
          this.authenticationService.saveUserToLocalStorage(response.body);

          // this.router.navigateByUrl('/category-list');
          this.router.navigateByUrl('/ticket-list');

          // hide spinner(circle)
          this.showLoading = false;

          this.shareService.sendClickEvent();
          // test
          // console.log(this.authenticationService.getRoleFromLocalStorage());
          // this.notificationService.notify(NotificationType.SUCCESS, this.authenticationService.getRoleFromLocalStorage());
        },
        // login failed
        (errorResponse: HttpErrorResponse) => {

          // show error message
          this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner icon(circle)
          this.showLoading = false;
        }
      )
    );
  }

  // show error message
  private sendErrorNotification(notificationType: NotificationType, message: string): void {

    // if there is message from system then use the system message
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else { // use custom message
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // this method is call right before component is destroyed.
  // avoid memeory leaks.
  ngOnDestroy(): void {
    // unsubscribe all subscription
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
