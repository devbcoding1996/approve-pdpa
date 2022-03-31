import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
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
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgxLoadingComponent } from 'ngx-loading';
import { ToastrService } from 'ngx-toastr';

const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#1976d2';

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
      console.log('params', ...params);
    });
    this.handleGetDetail();
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
    });
  }

  handleGetDetail() {
    this.userData.getUser().subscribe({
      next: (response) => this.handleGetResponseSuccess(response),
      error: (error) => this.handleGetResponseError(error),
    });
  }

  handleGetResponseSuccess(res: any) {
    this._uCard = res.uCard;
    this._uFullName = res.uFullName;
    this._uTel = res.uTel;
    this._uCarBody = res.uCarBody;
    this._uCarMotor = res.uCarMotor;
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
    console.log(res);
    this.loading = false;
    this.toastr.error(res.message, 'สำเร็จ!');
  }

  handleSubmitResponseError(error: any) {
    console.log(error);
    this.loading = false;
    this.toastr.error(error.message, 'ผิดพลาด!');
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
