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

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  userForm: FormGroup;
  user: User;

  errorMessages = {
    email: [
      { type: 'required', message: 'Please input an email' },
      { type: 'pattern', message: 'Email is incorrect format' }
    ],
    firstName: [
      { type: 'required', message: 'Please input the first name' },
      // { type: 'minlength', message: 'First name must be at least 1 character' },
      { type: 'maxlength', message: 'First name cannot be longer than 50 characters' },
    ],
    lastName: [
      { type: 'required', message: 'Please input the last name' },
      // { type: 'minlength', message: 'Last name must be at least 1 character' },
      { type: 'maxlength', message: 'Last name cannot be longer than 50 characters' },
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

  constructor(private router: Router,
    private userService: UserService,
    private notificationService: NotificationService) { }

  // this method ngOnInit() is run after the component "UserCreateComponent" is contructed
  ngOnInit(): void {

    // initial form
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      // firstName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")]),
      address: new FormControl('', [Validators.maxLength(300)]),
      // initial default value of the role = "ROLE_CUSTOMER"
      role: new FormControl('ROLE_CUSTOMER'),
      // initial default value of the status = "Active"
      status: new FormControl('Active')
    }
    );
  }

  // create user.
  // when user click the "Save" button in the "Create user"
  createUser() {

    // allow to show spinner(circle)
    this.showLoading = true;

    // push into the subscriptions list in order to unsubscribes all easily
    this.subscriptions.push(

      // create user
      this.userService.createUser(this.userForm.value).subscribe(

        // create user successful
        (data: User) => {

          this.user = data;
          // show successful message to user 
          this.sendNotification(NotificationType.SUCCESS, `${data.firstName} ${data.lastName} is created successfully`);

          // hide spinner(circle)
          this.showLoading = false;

          // navigate to the "user-list" page
          this.router.navigateByUrl("/user-list");
        },
        // create user failure
        (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showLoading = false;
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
