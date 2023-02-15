import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/entity/User';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  
  showLoading: boolean;

  // use to unsubcribe all subscribe easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  userForm: FormGroup;
  user: User;

  // isSuccessful = false;
  // isSignUpFailed = false;
  // errorMessage = '';
  // isSubmited = false;
  // formValid = false;

  constructor(private router: Router, private userService: UserService,
    private notificationService: NotificationService) { }

  errorMessages = {
    email: [
      { type: 'required', message: 'Please input an email' },
      { type: 'pattern', message: 'Email is incorrect format' }
    ],
    firstName: [
      { type: 'required', message: 'Please input the first name' },
      { type: 'maxlength', message: 'First name cannot be longer than 50 characters' },
      { type: 'minlength', message: 'First name must be at least 1 character' },
    ],
    lastName: [
      { type: 'required', message: 'Please input the last name' },
      { type: 'maxlength', message: 'Last name cannot be longer than 50 characters' },
      { type: 'minlength', message: 'FIrst name must be at least 1 character' },
    ],
    phone: [
      { type: 'required', message: 'Please input phone number' },
      { type: 'pattern', message: 'Phone number must be 10 digits length' }
    ],
    address: [
      { type: 'maxlength', message: 'Address cannot be longer than 300 characters' }
    ]
    // role: [
    //   { type: 'required', message: 'Please select a role' }
    // ],
    // status: [
    //   { type: 'required', message: 'Please select status' }
    // ]
  };

  ngOnInit(): void {

    // initial form
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")]),
      address: new FormControl('', [Validators.maxLength(300)]),
      // default value of role = "ROLE_CUSTOMER"
      role: new FormControl('ROLE_CUSTOMER'),
      // default value of status = "Active"
      status: new FormControl('Active')
    }
    );
  }

  // create user
  createUser() {

    // allow to show spinner(circle)
    this.showLoading = true;

    this.subscriptions.push(
      // create user
      this.userService.createUser(this.userForm.value).subscribe(
        (data: User) => {
          this.user = data;
          this.sendNotification(NotificationType.SUCCESS, `${data.firstName} ${data.lastName} is created successfully`);
                   
          // hide spinner(circle)
          this.showLoading = false;

          this.router.navigateByUrl("/user-list");
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showLoading = false;
        }
      )
    );

  }

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

}
