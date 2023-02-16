import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/entity/User';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  // allow display spinner or not
  // =true: allow to display spinner
  // =false: do not allow to display spinner
  showLoading: boolean;

  // use to unsubcribe all subscribe easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  userForm: FormGroup;
  user: User;

  // user id
  id: number;

  errorMessages = {
    // email: [
    //   { type: 'required', message: 'Please input an email' },
    //   { type: 'pattern', message: 'Email is incorrect format' }
    // ],
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
  };

  constructor(private router: Router, private userService: UserService, private notificationService: NotificationService,
    private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) { }

  // initial values
  ngOnInit(): void {

    this.userForm = this.formBuilder.group({

      // do not need validate id because this "id" field is read only
      id: [''],

      // email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],

      // do not need validate email because this "email" field is read only
      email: [''],

      firstName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      lastName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      address: ['', [Validators.maxLength(300)]],
      role: [''],
      status: ['']
    });

    // get user id from params of active route.
    // and get user based on user id from database
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {

      // get id from param of active route
      this.id = +params.get('id');

      // get user by user id
      this.userService.findById(this.id).subscribe(

        (data: User) => {

          this.user = data;

          // load user information to the userForm
          this.userForm.patchValue(data);

        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      );
    });

  }

  // edit user
  editUser() {

    // allow to show spinner(circle)
    this.showLoading = true;

    // push the subscribe to a list of subscriptions in order to easily unsubscribe them when destroy the component
    this.subscriptions.push(
      // edit exsting user
      this.userService.editUser(this.userForm.value).subscribe(
        (data: User) => {
          this.user = data;
          this.sendNotification(NotificationType.SUCCESS, `${data.firstName} ${data.lastName} is updated successfully`);

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
