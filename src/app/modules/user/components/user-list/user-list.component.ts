// import { AddUserComponent } from './../../../../models/user/components/add-user/add-user.component';
// import { MatDialogModule } from '@angular/material/dialog';
// import { Us /rvice } from './../../../../models/user/providers/user.service';
import { User } from './../../../../shared/interfaces';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../providers/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['fname', 'lname', 'phone', 'email', 'actions'];
  dataSource = new MatTableDataSource<User>([],);
  showLoader = false;
  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.showLoader = true;
    this.userService.getAllUser().subscribe(res => {
      this.dataSource.data = res;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    })
  }

  addNewUser() {
    this.dialog.open(AddUserComponent)
  }

  edit(user: User) {
    this.dialog.open(AddUserComponent, {
      data: {
        user,
        editView: true
      }
    }).afterClosed().subscribe(updated => {
      if (updated) {
        this.getAllData();
      }
    })
  }

  delete(user: User) {
    this.showLoader = true;
    this.userService.deleteUser(user._id).subscribe(res => {
      this.getAllData();
    }, err => {
      this.showLoader = false;
    });
  }

}
