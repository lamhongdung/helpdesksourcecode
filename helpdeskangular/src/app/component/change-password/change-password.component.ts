import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChangePassword } from 'src/app/entity/ChangePassword';
import { User } from 'src/app/entity/User';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { passwordValidator } from 'src/app/validator/validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: does not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  changePasswordForm: FormGroup;
  user: User;

  errorMessages = {
    oldPassword: [
      { type: 'required', message: 'Please input old password' }
    ],
    newPassword: [
      { type: 'required', message: 'Please input new password' }
    ],
    confirmNewPassword: [
      { type: 'required', message: 'Please input Confirm new password' }
    ]
  };

  constructor(private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService) { }

  // this method ngOnInit() is run after the component "UserCreateComponent" is contructed
  ngOnInit(): void {

    // initial form
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        confirmNewPassword: ['', [Validators.required]]
      },
      {
        // validate field "newPassword" and "confirmNewPassword"
        validators: [passwordValidator]
      }
    );

  }

  // create user.
  // when user click the "Save" button in the "Create user"
  changePassword(): void {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push into the subscriptions list in order to unsubscribes all easily
    this.subscriptions.push(

      // create user
      this.userService.createUser(this.changePasswordForm.value).subscribe(

        // create user successful
        (data: User) => {

          this.user = data;
          // show successful message to user 
          this.sendNotification(NotificationType.SUCCESS, `${data.firstName} ${data.lastName} is created successfully`);

          // hide spinner(circle)
          this.showSpinner = false;

          // navigate to the "user-list" page
          this.router.navigateByUrl("/user-list");
        },
        // create user failure
        (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      )
    );

  } // end of createUser()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "UserComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

} // end of the UserCreateComponent class
