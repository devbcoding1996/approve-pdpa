import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { UserDataService } from '../services/users-data.services';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
})
export class FormUserComponent implements OnInit {
  faAddressCard = faAddressCard;
  faUser = faUser;
  faCircle = faCircle;
  faPhone = faPhone;
  faCar = faCar;
  faFloppyDisk = faFloppyDisk;
  faCheck = faCheck;
  faXmark = faXmark;

  _ptEmail = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  _ptTal = '/^[0-9]d*$/';

  angForm: FormGroup;
  users: any;
  orderby: string;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userData: UserDataService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
    });

    this.formValidator();

    this.userData.users().subscribe((data) => {
      this.users = data;
    });
  }

  formValidator() {
    this.angForm = this.formBuilder.group({
      uCard: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(13),
        ],
      ],
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
  }

  handleSubmitForm(data: any) {
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
