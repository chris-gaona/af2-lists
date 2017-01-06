import { Component } from '@angular/core';

import { NavController, AlertController, ActionSheetController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthData } from '../../providers/auth-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  songs: FirebaseListObservable<any>;
  currentUser: any;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public actionSheetCtrl: ActionSheetController,
              public authData: AuthData,
              af: AngularFire) {
    this.currentUser = this.authData.getUserInfo();
    this.songs = af.database.list('/users/' + this.currentUser.uid + '/songs');
  }

  logoutUser() {
    this.authData.logoutUser();
  }

  addSong(){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Enter a name for this new song you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songs.push({
              title: data.title,
              created_at: (new Date()).getTime()
            });
          }
        }
      ]
    });
    prompt.present();
  }

  showOptions(songId, songTitle) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Delete Song',
          role: 'destructive',
          handler: () => {
            this.removeSong(songId);
          }
        },{
          text: 'Update title',
          handler: () => {
            this.updateSong(songId, songTitle);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  removeSong(songId: string){
    this.songs.remove(songId);
  }

  updateSong(songId, songTitle){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Update the name for this song",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: songTitle
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songs.update(songId, {
              title: data.title,
              updated_at: (new Date()).getTime()
            });
          }
        }
      ]
    });
    prompt.present();
  }

  getSongCount() {
    // console.log('songs', this.songs);
    //
    // let count = 0;
    // for (let i = 0; i < this.songs.length.length; i++) {
    //   count++;
    // }
    //
    // return count;
  }
}
