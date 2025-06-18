import { Component } from '@angular/core';
import { ClientImports } from '../client-imports';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { changePasswordConstants } from './change-password.constants';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {UserService} from "../../../core/services/user";
import { UserModel } from '../../../core/models/user';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ClientImports, FormsModule, ReactiveFormsModule, MatGridListModule, MatCardModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  passwordConstants = changePasswordConstants;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private userService: UserService
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  changePassword() {
    const user: UserModel = this.userService.getCurrentUser()!;
    if (this.changePasswordForm.valid) {
      const oldPassword = this.changePasswordForm.get('oldPassword')?.value;
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
         this.userService.editPassword(oldPassword, newPassword,user._id?? "null").subscribe({
        next: () => {
          this.toastrService.success(this.passwordConstants.SUCCESS);
          this.router.navigate(['/client/cv/']);
        },
        error: () => {
           this.toastrService.error(this.passwordConstants.Error);
        },
      });
    }
  }
}