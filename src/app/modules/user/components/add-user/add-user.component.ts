// import { AddUserComponent } from './../../../../models/user/components/add-user/add-user.component';
import { User } from './../../../../shared/interfaces';
// import { UserService } from './../../../../models/user/providers/user.service';
import { Component, Inject, OnInit, Sanitizer } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilesType } from 'src/app/shared/interfaces';
import { UserService } from '../../providers/user.service';
import { DomSanitizer } from '@angular/platform-browser';
export const REG_EX = {
  name: '^[a-zA-Z0-9]*$',
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(REG_EX.email)]),
    fname: new FormControl('', [Validators.required, Validators.pattern(REG_EX.name)]),
    lname: new FormControl('', [Validators.required, Validators.pattern(REG_EX.name)]),
    phone: new FormControl('', [Validators.required]),
  });
  showLoader = false;
  controls: any;
  imgSrc: String = '';
  file = '';
  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any = {},
    public dialogRef: MatDialogRef<AddUserComponent>
  ) {
    this.controls = this.userForm.controls;
  }

  ngOnInit(): void {
    if (this.data) {
      this.userForm.patchValue(this.data.user);
      this.getFile();
    }
  }

  async uploadFile(event: Event) {
    const dataUrl = await this.userService.handleFileChange(event, FilesType.Image);
    if (dataUrl) {
      this.file = (event.target as any).files[0];
    }
    this.imgSrc = dataUrl;
  }

  addUser() {
    if (this.data && this.data.editView) {
      this.updateUser(this.data.user._id);
      return;
    }
    const formData = new FormData();
    const formVal = this.userForm.value;
    if (this.userForm.valid) {
      if (!this.imgSrc) {
        return;
      }
      for (const key of Object.keys(formVal)) {
        if (formVal[key]) {
          formData.append(key, formVal[key]);
        }
      }
      formData.append('avatar', this.file);
      this.userService.addUser(formData).subscribe(res => {
        this.dialogRef.close(true)
      }, err => {
        console.log(err);
      });
    }
  }

  updateUser(id: string) {
    const formData = new FormData();
    const formVal = this.userForm.value;
    if (this.userForm.valid) {
      if (this.file) {
        formData.append('avatar', this.file);
      }
      for (const key of Object.keys(formVal)) {
        if (formVal[key]) {
          formData.append(key, formVal[key]);
        }
      }
      this.userService.updateUser(id, formData).subscribe(res => {
        this.dialogRef.close(true);
      }, err => {
        console.log(err);
      });
    }
  }

  get enablBtn() {
    if (this.data && this.data.editView) {
      return this.userForm.valid;
    }
    return this.userForm.valid && this.imgSrc;
  }


  getFile() {
    const fileId = this.data.avatar;
    if (fileId) {
      this.userService.getFile(fileId).subscribe((res: any) => {
        this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(res.file) as any;
      })
    }
  }

  get btnText() {
    return this.data && this.data.editView ? 'Update User' : 'Create User';
  }

}
