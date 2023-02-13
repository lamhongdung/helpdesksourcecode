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

  // current page
  currentPage: number = 1;
  // total page
  totalPage: number;
  // total of users  
  totalOfUsers: number;

  users: IUserDTO[] = [];

  searchUser = new FormGroup({
    searchTerm: new FormControl(''),
    role: new FormControl(''),
    status: new FormControl('')
  });


  // listUserNotPagination: IUserDTO[] = [];

  constructor(private userService: UserService) { }

  // this method ngOnInit() is run right after contructor
  ngOnInit(): void {

    // get first page from database
    this.userService.getAllUsers(0).subscribe(
      (data: IUserDTO[]) => {
        this.users = data;
      });

    // this.userService.getAllUsersNotPagination().subscribe(
    //   (data: IUserDTO[]) => {

    //     this.listUserNotPagination = data;

    //     if ((this.listUserNotPagination.length % 5) != 0) {
    //       this.totalPagination = (Math.round(this.listUserNotPagination.length / 5)) + 1;
    //     } else{
    //       this.totalPagination = this.listUserNotPagination.length / 5;
    //     }
    //   }
    // )

    this.userService.getTotalOfUsers().subscribe(
      (data: number) => {

        this.totalOfUsers = data;

        // if ((this.totalOfUsers % 5) != 0) {
        if ((this.totalOfUsers % this.userService.numOfLinesPerPage) != 0) {
          // this.totalPage = (Math.round(this.totalOfUsers / 5)) + 1;
          this.totalPage = (Math.round(this.totalOfUsers / this.userService.numOfLinesPerPage)) + 1;
        } else {
          // this.totalPage = this.totalOfUsers / 5;
          this.totalPage = this.totalOfUsers / this.userService.numOfLinesPerPage;
        }
      }
    )

  }

  search() {

  }

  // count line of toal
  // ex:  page 1: ord 1 --> ord 5
  //      page 2: ord 6 --> ord 10 (not repeat: ord 1 --> ord 5)
  lineOfTotal(currentPage: number, lineOfPage: number): number {

    // this.userService.numOfLinesPerPage = 5
    return (this.userService.numOfLinesPerPage * (currentPage - 1)) + (lineOfPage + 1);
  }

  goPaginnation() {
    // this.userService.getAllUsers((this.currentPage * 5) - 5).subscribe(
    this.userService.getAllUsers((this.currentPage * this.userService.numOfLinesPerPage) - this.userService.numOfLinesPerPage)
      .subscribe(
        (data: IUserDTO[]) => {
          this.users = data;
        })

  }

  indexPaginationChange(value: number) {
    this.currentPage = value;
  }

  firtPage() {
    this.currentPage = 1;
    this.ngOnInit();
  }

  nextPage() {
    this.currentPage = this.currentPage + 1;
    if (this.currentPage > this.totalPage) {
      this.currentPage = this.currentPage - 1;
    }
    // this.userService.getAllUsers((this.currentPage * 5) - 5).subscribe(
    this.userService.getAllUsers((this.currentPage * this.userService.numOfLinesPerPage) - this.userService.numOfLinesPerPage)
      .subscribe(
        (data: IUserDTO[]) => {
          this.users = data;
        })
  }

  previousPage() {
    this.currentPage = this.currentPage - 1;
    if (this.currentPage == 0) {
      this.currentPage = 1;
      this.ngOnInit();
    } else {
      // this.userService.getAllUsers((this.currentPage * 5) - 5).subscribe(
      this.userService.getAllUsers((this.currentPage * this.userService.numOfLinesPerPage) - this.userService.numOfLinesPerPage)
        .subscribe(
          (data: IUserDTO[]) => {
            this.users = data;
          })
    }
  }

  lastPage() {

    // this.indexPagination = this.listUserNotPagination.length / 5;
    this.currentPage = this.totalPage;

    // this.userService.getAllUsers((this.currentPage * 5) - 5).subscribe(
    this.userService.getAllUsers((this.currentPage * this.userService.numOfLinesPerPage) - this.userService.numOfLinesPerPage)
      .subscribe(
        (data: IUserDTO[]) => {
          this.users = data;
        })
  }
}
