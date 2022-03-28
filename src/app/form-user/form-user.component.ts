import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import {
  faAddressCard,
  faUser,
  faCircle,
  faPhone,
  faCar,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';
import { UserDataService } from '../services/users-data.services';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
})
export class FormUserComponent {
  faAddressCard = faAddressCard;
  faUser = faUser;
  faCircle = faCircle;
  faPhone = faPhone;
  faCar = faCar;
  faFloppyDisk = faFloppyDisk;

  _ptCarMotor = '^[a-z0-9_-]{8,15}$';
  _ptEmail = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  _ptTal = '/^[0-9]d*$/';

  angForm: FormGroup;
  users: any;

  constructor(
    private formBuilder: FormBuilder,
    private userData: UserDataService
  ) {
    this.angForm = this.formBuilder.group({
      uCard: [null, [Validators.required]],
      uFullName: [null, [Validators.required]],
      uTel: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
        ],
      ],
      uCarCody: [
        null,
        [Validators.required, Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)],
      ],
      uCarMotor: [
        null,
        [Validators.required, Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)],
      ],
    });

    this.userData.users().subscribe((data) => {
      this.users = data;
    });
  }

  getUserFormData(data: any) {
    if (this.angForm.valid) {
      this.userData.saveUser(data).subscribe((res) => {
        console.warn(res);
      });
    } else {
      this.validateAllFormFields(this.angForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
