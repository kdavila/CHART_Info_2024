import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { chartTypesList } from '../core/ChartTypes';
import { FormsModule } from '@angular/forms';
import { ImageAssignation } from '../models/ImageAssignation';
import { ToastrService } from 'ngx-toastr';
import { DataServiceService } from '../core/data-service.service';
import { User } from '../models/User';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Chart } from '../models/Chart';
import { getDatabase, ref, update, remove } from "firebase/database";
import { take } from 'rxjs';
import { ChartAssigned, ChartAvailable } from '../models/ChartDbStructure';

@Component({
  selector: 'app-image-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './image-assignment.component.html',
  styleUrls: ['./image-assignment.component.css']
})
export class ImageAssignmentComponent implements OnInit {
  chartTypes: Array<Chart> = [];
  annotators: Array<User> = [];
  imageAssign: ImageAssignation = {
    panelType: '',
    hasChart: '',
    amountImages: 0,
    assignTo: 0,
    difficulty: '',
    chartType: 'None'
  };
  faPaperPlane = faPaperPlane;
  constructor(private toastr: ToastrService, private dataService: DataServiceService, private realtimeDb: AngularFireDatabase) { }

  ngOnInit(): void {
    this.chartTypes = chartTypesList;

    this.dataService.getAnnotators()
        .then(snap => snap.subscribe(
          {
            next: (users: User[]) => {
              users.forEach(user => {
                this.annotators.push(user);
              })
            },
            error: error => console.log(error.message)
          }),
          reason => console.log(reason));
  }

  onSubmit() {   
    this.getImages();
  }

  getImages(){
    if (this.imageAssign.hasChart == '0' || this.imageAssign.panelType == '1'){
      this.imageAssign.chartType = 'None'
    }
    
    var query = `${this.imageAssign.panelType}_${this.imageAssign.hasChart}_${this.imageAssign.chartType}`
    
    if (this.imageAssign.difficulty == 'Easy') {
      this.realtimeDb
      .list(`available/${query}`,  ref => ref.orderByChild('score').limitToLast(this.imageAssign.amountImages))
      .snapshotChanges()
      .pipe(take(1))
      .subscribe({
        next: (charts: any) => {
          this.assignImages(charts, query);
        },
        error: error => this.toastr.error(`${error}`, 'Unsuccessful assignation')
      })
    }
    else if(this.imageAssign.difficulty == 'Hard'){
      this.realtimeDb
      .list(`available/${query}`,  ref => ref.orderByChild('score').limitToFirst(this.imageAssign.amountImages))
      .snapshotChanges()
      .pipe(take(1))
      .subscribe({
        next: (charts: any) => {
          this.assignImages(charts, query);
        },
        error: error => this.toastr.error(`${error}`, 'Unsuccessful assignation')
      })
    }
    else {
      this.realtimeDb
      .list(`available/${query}`,  ref => ref.orderByKey().limitToFirst(this.imageAssign.amountImages))
      .snapshotChanges()
      .pipe(take(1))
      .subscribe({
        next: (charts: any) => {
          this.assignImages(charts, query);
        },
        error: error => this.toastr.error(`${error}`, 'Unsuccessful assignment')
      })
    }
    
  }

  assignImages(charts: any, query: string){
    if (charts.length <= 0) {
      this.toastr.info(`No images were found for assignment`);
      return;
    }  
    var updates: any = {};
    var removes: any = {};
    let chartAssigned: ChartAssigned = {
      score: 0,
      preClass: ''
    };
    charts.forEach((chart: any) => {
      chartAssigned.ext = null;
      chartAssigned.n_reject = null;
      let chartAvailable: ChartAvailable = chart.payload.toJSON();
      if (chartAvailable.n_reject != null && chartAvailable.n_reject > 0){
        chartAssigned.n_reject = chartAvailable.n_reject;
      } 
      chartAssigned.score = chartAvailable.score;
      if(chartAvailable.ext != null || chartAvailable.ext != undefined){
        chartAssigned.ext = chartAvailable.ext;
      }
      chartAssigned.preClass = query;
      updates[`/assigned/${this.imageAssign.assignTo}/${chart.key}`] = {...chartAssigned};
      removes[`/available/${query}/${chart.key}`] = null;
    })

    this.postImages(updates, removes);
  }

  postImages(updates: any, removes: any){
    const db = getDatabase();
    update(ref(db), updates) //adding to assigned
      .then(() => {
        update(ref(db), removes); //removing from available
        var annotator = this.annotators.find(user => user.id == this.imageAssign.assignTo);
        this.toastr.success(`Assign to: ${annotator.name}`, 'Successful assignment');
        this.imageAssign = {
          panelType: '',
          hasChart: '',
          amountImages: 0,
          assignTo: 0,
          difficulty: '',
          chartType: 'None'
        };
      })
      .catch((error) => {
        this.toastr.error(`${error}`, 'Unsuccessful assignment')
      });
    
  }
}
