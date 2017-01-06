import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../validators/email';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public signupForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthData,
              public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    this.signupForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required,
        EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6),
        Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  /**
   * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
   */

  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  /**
   * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
   * component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */

  signupUser(){
    this.submitAttempt = true;

    this.loading = this.loadingCtrl.create({});

    this.loading.present();

    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
      this.loading.dismiss();

    } else {
      this.authData.signupUser(this.signupForm.value.email,
        this.signupForm.value.password).then(() => {
        this.authData.updateProfile(this.signupForm.value.name, '').then(() => {
          this.navCtrl.setRoot(HomePage).then(() => {
            this.loading.dismiss();
          });
        });
      }, (error) => {
        this.loading.dismiss().then( () => {
          var errorMessage: string = error.message;
          let alert = this.alertCtrl.create({
            message: errorMessage,
            buttons: [{ text: "Ok", role: 'cancel' } ]
          });

          alert.present();
        });
      });

    }
  }
}
