import { Component, OnInit, ɵɵinjectPipeChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
// import { IUserDTO } from 'src/app/entity/IUserDTO';
import { User } from 'src/app/entity/User';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  // use to unsubcribe all subscribe easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // current page
  currentPage: number = 1;
  // total page
  totalOfPages: number;
  // total of users(for pagination)
  totalOfUsers: number;
  // user list
  users: User[] = [];
  // number of users per a page
  pageSize: number;
  // form controls
  searchUser = new FormGroup({
    searchTerm: new FormControl(''),
    role: new FormControl(''),
    status: new FormControl('')
  });


  constructor(private userService: UserService,private notificationService: NotificationService) { }

  // this method ngOnInit() is run right after contructor
  ngOnInit(): void {

    // initial page size(default = 5)
    this.pageSize = this.userService.pageSize;

    // initial current page
    this.currentPage = 1;

    // assign users from database to this.users variable, and get totalOfPages
    this.searchUsers(0, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status);

    // this.notificationService.notify(NotificationType.SUCCESS, `There are ${this.totalOfUsers} users`);

  } // end of ngOnInit()

  // calculate total of pages for pagination
  calculateTotalOfPages(totalOfUsers: number, pageSize: number): number {

    let totalOfPage: number = 0;

    if ((totalOfUsers % pageSize) != 0) {
      //  Math.floor: rounds down and returns the largest integer less than or equal to a given number
      totalOfPage = (Math.floor(totalOfUsers / pageSize)) + 1;
    } else {
      totalOfPage = totalOfUsers / pageSize;
    }

    return totalOfPage;
  }

  // get users, total of users and total of pages
  searchUsers(page: number, searchTerm: string, role: string, status: string) {

    this.subscriptions.push(
      // get users
      this.userService.searchUsers(page, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status)
        .subscribe((data: User[]) => {
          return this.users = data
        })
    );

    this.subscriptions.push(
      // get total of users and total of pages
      this.userService.getTotalOfUsers(this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status)
      .subscribe(
        (data: number) => {
          // total of users
          this.totalOfUsers = data;
          // total of pages
          this.totalOfPages = this.calculateTotalOfPages(this.totalOfUsers, this.pageSize);
        }
      )
    )
  }

  // count index for current page
  // ex:  page 1: ord 1 --> ord 5
  //      page 2: ord 6 --> ord 10 (not repeat: ord 1 --> ord 5)
  // parameters:
  //  - currentPage: current page
  //  - index: running variable(index variable of "for loop")
  indexBasedPage(currentPage: number, index: number): number {

    // this.pageSize = 5
    return (this.pageSize * (currentPage - 1)) + (index + 1);
  }

  // go to specific page
  goPage() {

    // if 1 <= currentPage <= totalOfPages then go to specific page
    if (this.currentPage >= 1 && this.currentPage <= this.totalOfPages) {

      // page number in mysql
      let sqlPage = (this.currentPage * this.pageSize) - this.pageSize;
  
      // get users, total of users and total of pages
      this.searchUsers(sqlPage, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status);
    }

  }

  // user change page number in the text box
  indexPaginationChange(value: number) {
    this.currentPage = value;
  }

  // move to the first page
  moveFirst() {
    
    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = 1;

      // page number in mysql
      let sqlPage = (this.currentPage * this.pageSize) - this.pageSize;
  
      // get users, total of users and total of pages
      this.searchUsers(sqlPage, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status);
    }

  }

  // move to the next page
  moveNext() {

    // if current page is not the last page
    if (this.currentPage < this.totalOfPages){

      this.currentPage = this.currentPage + 1;

      // page number in mysql
      let sqlPage = (this.currentPage * this.pageSize) - this.pageSize;
  
      // get users, total of users and total of pages
      this.searchUsers(sqlPage, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status);
    }

  }

  // move to the previous page
  movePrevious() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = this.currentPage - 1;

      // page number in mysql
      let sqlPage = (this.currentPage * this.pageSize) - this.pageSize;
  
      // get users, total of users and total of pages
      this.searchUsers(sqlPage, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status);
    }

  }

  // move to the last page
  moveLast() {

    // if current page is not the last page
    if (this.currentPage < this.totalOfPages) {

      this.currentPage = this.totalOfPages;

      // page number in mysql
      let sqlPage = (this.currentPage * this.pageSize) - this.pageSize;
  
      // get users, total of users and total of pages
      this.searchUsers(sqlPage, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status);
    }
  }

  // unsubscribe all subscriptions from this component "UserComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
