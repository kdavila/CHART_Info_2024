import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Database, equalTo, get, orderByChild, query, update } from '@angular/fire/database';
import { getDatabase, ref, onValue} from "firebase/database";
import { map, Observable, of } from 'rxjs';
import { Image } from '../models/Image';
import { User } from '../models/User';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  chartsRef!: AngularFireList<any>;

  constructor(public database: Database, private realtimeDb: AngularFireDatabase) { }

  getImagesForAnnotator(assign_to: string):void {
    const db = getDatabase();
    const assignToChartsRef = query(ref(db, 'charts'), orderByChild('assignTo'), equalTo(assign_to));
    console.log(assignToChartsRef.toJSON())
    /*
    assignToChartsRef.once("value", function(snapshot) {
      console.log(snapshot.val());
    });
    */
  }

  async getAllImages(): Promise<Observable<Image[]>>{
    var images: Image[] = [];
    const db = getDatabase();
    const snapshot = await get(ref(db, 'charts'))
    const data = snapshot.val();
    data.forEach((chart: any) => {
      if(chart != null){
        images.push(chart as Image);
      }
    });
    return of(images);
  }

  async getUsers(): Promise<Observable<User[]>>{
    var users: User[] = [];
    const db = getDatabase();
    const snapshot = await get(ref(db, 'users'))
    const data = snapshot.val();
    data.forEach((user: any) => {
      if(user != null){
        users.push(user as User);
      }
    });
    return of(users);
  }

  async getUser(username: string, password: string): Promise<Observable<Array<User>>> {
    const usersRef = ref(this.database, 'users');
    const q = query(usersRef, orderByChild('username'), equalTo(username));
    var users: User[] = [];
    const snapshot = await get(q)
    const data = snapshot.val();
    if (data == null || data == undefined){
      throw new Error('Username not found');
    }
    for (var k in data) 
    {
      if (data[k].password == password) {
        users.push(data[k] as User);
      }
      else {
        throw new Error('Wrong password');
      }
    }
    return of(users);
  }

  getUserRT(): Observable<User[]>{
    this.chartsRef = this.realtimeDb.list('users',  ref => ref.orderByChild('name').equalTo('kenny'));
    var users: User[] = [];
    this.chartsRef.snapshotChanges().subscribe(data => {
      data.forEach(user => {
        let a = user.payload.toJSON();
        if(a != null){
          users.push(a as User);
        }
      })
      return of(users);
    })
    return of(users);
  }

  async getAnnotators(): Promise<Observable<Array<User>>> {
    const usersRef = ref(this.database, 'users');
    const q = query(usersRef, orderByChild('roles/annotator'), equalTo(true));
    var users: User[] = [];
    const snapshot = await get(q)
    const data = snapshot.val();
    for (var k in data) {
      users.push(data[k] as User);
    }
    return of(users);
  }

  async updateChart(chart: Image): Promise<void> {
    const db = getDatabase();
    await update(ref(db, 'charts/' + chart.imageName), chart);
  }

}
