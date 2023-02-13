import { Component, OnInit, ɵɵinjectPipeChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IUserDTO } from 'src/app/entity/IUserDTO';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  // // search term
  // searchTerm: string = "";
  // // role
  // role: string = ""; // all roles
  // // status
  // status: string = ""; // all status


  // current page
  currentPage: number = 1;
  // total page
  totalPage: number;
  // total of users(for pagination)
  totalOfUsers: number;

  users: IUserDTO[] = [];

  searchUser = new FormGroup({
    searchTerm: new FormControl(''),
    role: new FormControl(''),
    status: new FormControl('')
  });


  constructor(private userService: UserService) { }

  // this method ngOnInit() is run right after contructor
  ngOnInit(): void {

    // // get first page from database
    // this.userService.getUsersByPage(0).subscribe(
    //   (data: IUserDTO[]) => {
    //     this.users = data;
    //   });
    this.currentPage = 1;

    this.search();
    console.log("this.searchUser.value.searchTerm:" + this.searchUser.value.searchTerm);

    // get total of users for pagination.
    // and then calculate total of pages based on total of users.
    this.userService.getTotalOfUsers(this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status)
      .subscribe(
        (data: number) => {

          this.totalOfUsers = data;

          console.log("total of users:" + this.totalOfUsers);
          console.log("numOfLinesPerPage:" + this.userService.numOfLinesPerPage);
          console.log("this.totalOfUsers % this.userService.numOfLinesPerPage:" + this.totalOfUsers % this.userService.numOfLinesPerPage);
          console.log("totalPage:" + Math.round(this.totalOfUsers / this.userService.numOfLinesPerPage));
          // calculate total of pages.
          // this.userService.numOfLinesPerPage: number of users per a page.
          // if ((this.totalOfUsers % 5) != 0) {
          if ((this.totalOfUsers % this.userService.numOfLinesPerPage) != 0) {
            // this.totalPage = (Math.round(this.totalOfUsers / 5)) + 1;
            // this.totalPage = (Math.round(this.totalOfUsers / this.userService.numOfLinesPerPage)) + 1;
            this.totalPage = (Math.floor(this.totalOfUsers / this.userService.numOfLinesPerPage)) + 1;
          } else {
            // this.totalPage = this.totalOfUsers / 5;
            this.totalPage = this.totalOfUsers / this.userService.numOfLinesPerPage;
          }

          console.log("total page:" + this.totalPage);
        }
      )

  } // end of ngOnInit()

  search() {
    this.userService.search(0, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status)
      .subscribe((data: IUserDTO[]) => {
        return this.users = data
      });
  }

  // count line of total
  // ex:  page 1: ord 1 --> ord 5
  //      page 2: ord 6 --> ord 10 (not repeat: ord 1 --> ord 5)
  // parameters:
  //  - currentPage: current page
  //  - lineOfPage: running variable(index variable of "for loop")
  lineOfTotal(currentPage: number, lineOfPage: number): number {

    // this.userService.numOfLinesPerPage = 5
    return (this.userService.numOfLinesPerPage * (currentPage - 1)) + (lineOfPage + 1);
  }

  // go to specific page
  goPage() {
    // numOfLinesPerPage: number of users per a page.
    // this.userService.getAllUsers((this.currentPage * 5) - 5).subscribe(
    this.userService.getUsersByPage((this.currentPage * this.userService.numOfLinesPerPage) - this.userService.numOfLinesPerPage)
      .subscribe(
        (data: IUserDTO[]) => {
          this.users = data;
        })
  }

  indexPaginationChange(value: number) {
    this.currentPage = value;
  }

  // move to the first page
  moveFirst() {
    this.currentPage = 1;
    // this.ngOnInit();
    this.userService.search(0, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status)
      .subscribe((data: IUserDTO[]) => {
        return this.users = data
      });
  }

  // move to the next page
  moveNext() {
    this.currentPage = this.currentPage + 1;
    if (this.currentPage > this.totalPage) {
      this.currentPage = this.currentPage - 1;
    }
    // // this.userService.getAllUsers((this.currentPage * 5) - 5).subscribe(
    // this.userService.getUsersByPage((this.currentPage * this.userService.numOfLinesPerPage) - this.userService.numOfLinesPerPage)
    //   .subscribe(
    //     (data: IUserDTO[]) => {
    //       this.users = data;
    //     })

    let sqlPage = (this.currentPage * this.userService.numOfLinesPerPage) - this.userService.numOfLinesPerPage;

    this.userService.search(sqlPage, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status)
      .subscribe((data: IUserDTO[]) => {
        return this.users = data
      });
  }

  // move to the previous page
  movePrevious() {
    this.currentPage = this.currentPage - 1;
    if (this.currentPage == 0) {
      this.currentPage = 1;
      this.ngOnInit();
    } else {
      // // this.userService.getAllUsers((this.currentPage * 5) - 5).subscribe(
      // this.userService.getUsersByPage((this.currentPage * this.userService.numOfLinesPerPage) - this.userService.numOfLinesPerPage)
      //   .subscribe(
      //     (data: IUserDTO[]) => {
      //       this.users = data;
      //     })

      let sqlPage = (this.currentPage * this.userService.numOfLinesPerPage) - this.userService.numOfLinesPerPage;

      this.userService.search(sqlPage, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status)
        .subscribe((data: IUserDTO[]) => {
          return this.users = data
        });
    }
  }

  // move to the last page
  moveLast() {

    // this.indexPagination = this.listUserNotPagination.length / 5;
    this.currentPage = this.totalPage;

    // // this.userService.getAllUsers((this.currentPage * 5) - 5).subscribe(
    // this.userService.getUsersByPage((this.currentPage * this.userService.numOfLinesPerPage) - this.userService.numOfLinesPerPage)
    //   .subscribe(
    //     (data: IUserDTO[]) => {
    //       this.users = data;
    //     })

    let sqlPage = (this.currentPage * this.userService.numOfLinesPerPage) - this.userService.numOfLinesPerPage;

    this.userService.search(sqlPage, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status)
      .subscribe((data: IUserDTO[]) => {
        return this.users = data
      });
  }
}
