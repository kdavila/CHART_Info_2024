import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageAnnotation } from '../models/ImageAnnotation';
import { ImageAnnotationThumbnailComponent } from '../image-annotation-thumbnail/image-annotation-thumbnail.component'
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../core/auth.service';
import { User } from '../models/User';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { take } from 'rxjs';
import { getDatabase, ref, update, remove } from "firebase/database";
import { ChartAssigned, ChartAnnotated } from '../models/ChartDbStructure';
import { ImageurlService } from '../core/imageurl.service';

@Component({
  selector: 'app-image-annotation',
  standalone: true,
  imports: [CommonModule, ImageAnnotationThumbnailComponent],
  templateUrl: './image-annotation.component.html',
  styleUrls: ['./image-annotation.component.css']
})
export class ImageAnnotationComponent implements OnInit {

  user: User = {
    id: 0,
    name: '',
    password: '',
    roles: {
      admin: false,
      annotator: false,
      validator: false
    },
    username: ''
  }
  imagesForAnnotation: ImageAnnotation[] = [];
  index: number = 0;
  imageAnnotated: ImageAnnotation = {
    imageName: '',
    imageUrl: '',
    score: 0,
    preClass: ''
  };
  enablePrev: boolean = false;
  enableNext: boolean = false;
  annotationDone: boolean = false;
  loading: boolean = true;

  constructor(private toastr: ToastrService, private auth: AuthService, private realtimeDb: AngularFireDatabase, private urlService: ImageurlService) { }

  ngOnInit(): void {
    this.user = this.auth.getUserLoggedIn;
    this.realtimeDb
    .list(`assigned/${this.user.id}`,  ref => ref.orderByKey())
    .snapshotChanges()
    .pipe(take(1))
    .subscribe((charts: any) => {
      this.loading = false;
      this.imagesForAnnotation = charts.map((chart: any) => {
        let chartAssigned: ChartAssigned = chart.payload.toJSON();
        let preclass = chartAssigned.preClass.split("_");
        (chartAssigned as ImageAnnotation).imageName = chart.key.split('&').join('.');
        (chartAssigned as ImageAnnotation).imageUrl =  this.urlService.getImageUrl(chart.key.split('&').join('.'), chartAssigned.ext);
        (chartAssigned as ImageAnnotation).chartClass = preclass[2];
        (chartAssigned as ImageAnnotation).hasChart = preclass[1] == '1' ? true : false;
        (chartAssigned as ImageAnnotation).multiPanel = preclass[0] == '1' ? true : false;
        return chartAssigned;
      });
      this.annotationDone = this.imagesForAnnotation.length == 0 ? true : false;
      this.imageAnnotated = this.imagesForAnnotation[this.index];
      this.enableNext = this.imagesForAnnotation.length <= 1 ? false : true;
    })
  }

  previousImage(): void {
    this.enableNext = true;
    if (this.enablePrev) this.imageAnnotated = this.imagesForAnnotation[--this.index];

    if (this.index > 0)
    {
      this.enablePrev = true;
    }
    else {
      this.enablePrev = false;
    }
    if (this.index == this.imagesForAnnotation.length - 1){
      this.enableNext = false;
    }
  }

  nextImage(): void {
    this.enablePrev = true;
    if (this.enableNext) this.imageAnnotated = this.imagesForAnnotation[++this.index];

    if(this.index < this.imagesForAnnotation.length - 1){
      this.enableNext = true;
    }
    else {
      this.enableNext = false;
    }
    if (this.index == 0){
      this.enablePrev = false;
    }
  }

  randomImage(): void {
    this.index = this.getRandomInt(this.imagesForAnnotation.length);
    this.imageAnnotated = this.imagesForAnnotation[this.index];
    if(this.index < this.imagesForAnnotation.length - 1){
      this.enableNext = true;
    }
    else {
      this.enableNext = false;
    }
    if (this.index == 0){
      this.enablePrev = false;
    }
    else {
      this.enablePrev = true;
    }
  }

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  annotateImage(image: ImageAnnotation):void{
    const db = getDatabase();
    let chartAnnotated: ChartAnnotated = {
      score: image.score,
      preClass: image.preClass,
      chartClass: image.chartClass,
      hasChart: image.hasChart,
      multiPanel: image.multiPanel,
      assignTo: this.user.username
    }
    if (image.n_reject != null && image.n_reject > 0){
      chartAnnotated.n_reject = image.n_reject;
    } 
    if(image.ext != null || image.ext != undefined){
      chartAnnotated.ext = image.ext;
    }
    image.imageName = image.imageName.split('.').join('&');
    update(ref(db, `/annotated/${image.imageName}`), chartAnnotated) //adding chart to annotated
    .then(() => {
      remove(ref(db, `/assigned/${this.user.id}/${image.imageName}`)); //removing chart from assigned
      this.imagesForAnnotation.splice(this.index, 1);
      this.annotationDone = this.imagesForAnnotation.length == 0 ? true : false;
      this.toastr.success(`Image ${this.imageAnnotated.imageName}`, 'Successful annotation');
      if (!this.annotationDone){
        if (this.imagesForAnnotation.length == 1){
          this.index = 0;
          this.imageAnnotated = this.imagesForAnnotation[this.index];
          this.enableNext = false;
          this.enablePrev = false;
        }
        else if (this.enablePrev)
          this.previousImage();
        else
          this.nextImage();
      }
    })
    .catch((error) => {
      this.toastr.error(`${error}`, 'Unsuccessful annotation');
    });
  }

}
