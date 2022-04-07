import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { environment } from 'src/environments/environment';

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
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgxLoadingComponent } from 'ngx-loading';
import { ToastrService } from 'ngx-toastr';
import { invalid } from '@angular/compiler/src/render3/view/util';

const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
})
export class FormUserComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false })
  ngxLoadingComponent!: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false })
  customLoadingTemplate!: TemplateRef<any>;
  @ViewChild('emptyLoadingTemplate', { static: false })
  emptyLoadingTemplate!: TemplateRef<any>;

  showingTemplate = false;
  imgUrl = environment.imgPath;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading: any;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public loadingTemplate!: TemplateRef<any>;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
    secondaryColour: this.secondaryColour,
    tertiaryColour: this.primaryColour,
    backdropBorderRadius: '3px',
  };

  public faAddressCard = faAddressCard;
  public faUser = faUser;
  public faCircle = faCircle;
  public faPhone = faPhone;
  public faCar = faCar;
  public faFloppyDisk = faFloppyDisk;
  public faCheck = faCheck;
  public faXmark = faXmark;

  _uCard: string;
  _uFullName: string;
  _uTel: string;
  _uCarBody: string;
  _uCarMotor: string;
  _uDataID: string;
  _ptEmail = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  _ptTal = '/^[0-9]d*$/';

  angForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userData: UserDataService,
    private toastr: ToastrService
  ) {
    this.formValidator();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((...params) => {
      params.map((res: any) => {
        this._uDataID = res.DataID;
        this.handleGetDetail(res.DataID);
      });
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
      uCarBody: [
        null,
        [Validators.required, Validators.pattern(/^(?:[a-zA-Z0-9._%+-\s]+)?$/)],
      ],
      uCarMotor: [
        null,
        [Validators.required, Validators.pattern(/^(?:[a-zA-Z0-9._%+-\s]+)?$/)],
      ],
      uDataID: [null],
      uAcceptPolicy: [null, [Validators.required]],
    });
  }

  handleGetDetail(data: any) {
    this.userData.getUser(data).subscribe({
      next: (response) => this.handleGetResponseSuccess(response),
      error: (error) => this.handleGetResponseError(error),
    });
  }

  handleGetResponseSuccess(res: any) {
    if (res.Status == 400) {
      this.toastr.error(res.Data, 'ผิดพลาด!');
    } else {
      this._uCard = res.Data.uCard;
      this._uFullName = res.Data.uFullName;
      this._uTel = res.Data.uTel;
      this._uCarBody = res.Data.uCarBody;
      this._uCarMotor = res.Data.uCarMotor;
    }
  }

  handleGetResponseError(error: any) {
    this.toastr.error(error.message, 'ผิดพลาด!');
  }

  handleSubmitForm(data: any) {
    if (this.angForm.valid) {
      this.loading = true;
      this.userData.postUser(data).subscribe({
        next: (...response) => this.handleSubmitResponseSuccess(...response),
        error: (...error) => this.handleSubmitResponseError(...error),
      });
    } else {
      this.validateAllFormFields(this.angForm);
    }
  }

  handleSubmitResponseSuccess(res: any) {
    this.loading = false;
    if (res.Status == 400) {
      this.toastr.warning(res.Data, 'ผิดพลาด!');
      document.getElementById('btn-close')?.click();
    } else {
      this.toastr.success('ข้อมูลของท่านได้รับการยืนยันแล้ว', 'สำเร็จ!');
      document.getElementById('btn-close')?.click();
    }
  }

  handleSubmitResponseError(error: any) {
    console.log(error);
    this.loading = false;
    this.toastr.error('บันทึกข้อมูลไม่สำเร็จ', 'ผิดพลาด!');
    document.getElementById('btn-close')?.click();
  }

  handleReject() {
    this.toastr
      .success(
        'ท่านไม่ยินยอมรับเงื่อนไขและข้อตกลง นโยบายความเป็นส่วนตัว',
        'สำเร็จ!'
      )
      .onHidden.subscribe(() => {
        console.log('toastr closed...');
      });
  }

  handleCheckPolicy(event: any) {
    if (event.target.checked == false) {
      this.angForm.controls['uAcceptPolicy'].setErrors({'incorrect': true});
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
