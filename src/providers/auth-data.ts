import { Injectable } from '@angular/core';

import { AngularFire, FirebaseAuthState } from 'angularfire2';

/*
  Generated class for the AuthData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthData {
  fireAuth: any;
  authState: FirebaseAuthState;

  constructor(public af: AngularFire) {
    af.auth.subscribe( user => {
      this.authState = user;

      if (user) {
        this.fireAuth = user.auth;
        console.log(user);
      }
    });
  }

  getUserInfo() {
    return this.fireAuth;
  }

  loginUser(newEmail: string, newPassword: string): any {
    return this.af.auth.login({ email: newEmail, password: newPassword });
  }

  resetPassword(email: string): any {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): any {
    return this.af.auth.logout();
  }

  signupUser(newEmail: string, newPassword: string): any {
    return this.af.auth.createUser({ email: newEmail, password: newPassword });
  }

  updateProfile(displayName, photoURL) {
    return this.authState.auth.updateProfile({displayName: displayName, photoURL: null});
  }
}
