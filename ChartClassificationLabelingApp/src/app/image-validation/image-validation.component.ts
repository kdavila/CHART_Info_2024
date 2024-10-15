import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageValidationThumbnailComponent } from '../image-validation-thumbnail/image-validation-thumbnail.component';
import { Image } from '../models/Image';
import { FormsModule } from '@angular/forms';
import { ChartTypeFilterComponent } from '../image-validation-filters/chart-type-filter/chart-type-filter.component';
import { HasChartsFilterComponent } from '../image-validation-filters/has-charts-filter/has-charts-filter.component';
import { MultiPanelFilterComponent } from '../image-validation-filters/multi-panel-filter/multi-panel-filter.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../core/auth.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from '../models/User';
import { take } from 'rxjs';
import { ImageValidation } from '../models/ImageValidation';
import { getDatabase, ref, update } from "firebase/database";
import { ChartAnnotated, ChartValidated } from '../models/ChartDbStructure';
import { ImageurlService } from '../core/imageurl.service';
import { DataServiceService } from '../core/data-service.service';

@Component({
  selector: 'app-image-validation',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageValidationThumbnailComponent, ChartTypeFilterComponent, HasChartsFilterComponent, MultiPanelFilterComponent],
  templateUrl: './image-validation.component.html',
  styleUrls: ['./image-validation.component.css']
})
export class ImageValidationComponent implements OnInit{
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
  imagesToValidate: Array<ImageValidation> = [];
  filteredImages: Array<ImageValidation> = [];
  imagesDisplayTopRow: Array<ImageValidation> = [];
  imagesDisplayBottomRow: Array<ImageValidation> = [];
  currentPage: number = 1;
  totalImages: number = 0;
  imagesPerPage: number = 8;
  pages: Array<[string, number]> = [];
  multiPanelFilter: string = 'Any';
  hasChartFilter: string = 'Any';
  chartTypeFilter: string = 'Any';
  loading: boolean = true;
  annotators: Array<User> = [];

  constructor(private toastr: ToastrService, private auth: AuthService, private realtimeDb: AngularFireDatabase, private urlService: ImageurlService, private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.user = this.auth.getUserLoggedIn;
    this.realtimeDb
    .list('annotated',  ref => ref.orderByKey())
    .snapshotChanges()
    .pipe(take(1))
    .subscribe((charts: any) => {
      this.loading = false;
      this.imagesToValidate = charts.map((chart: any) => {
        let chartAnnotated: ChartAnnotated = chart.payload.toJSON();
        (chartAnnotated as ImageValidation).imageName = chart.key.split('&').join('.');
        (chartAnnotated as ImageValidation).imageUrl =  this.urlService.getImageUrl(chart.key.split('&').join('.'), chartAnnotated.ext);
        (chartAnnotated as ImageValidation).selected = false;
        return chartAnnotated;
      });
      this.filteredImages = this.imagesToValidate;
      this.totalImages = this.filteredImages?.length == undefined ? 0 : this.filteredImages.length;
      for (let i = 0; i < Math.ceil(this.totalImages / this.imagesPerPage); i++) {
        this.pages.push([`page${i + 1}`, i + 1]);
      }
      this.divideImages();
      this.disableButtons();
    }) 
    
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

  divideImages(): void {
    if (this.totalImages == 0) {
      this.imagesDisplayTopRow = []
      this.imagesDisplayBottomRow = []
      return;
    }
    var indexCurrent: number;
    for (let index = 0; index < this.imagesPerPage / 2; index++) {
      indexCurrent = (this.currentPage - 1) * this.imagesPerPage + index;
      if (indexCurrent >= this.filteredImages.length)
      {
        return;
      }
      this.imagesDisplayTopRow.push(this.filteredImages[indexCurrent]);
    }
    for (let index = this.imagesPerPage / 2; index < this.imagesPerPage; index++) {
      indexCurrent = (this.currentPage - 1) * this.imagesPerPage + index;
      if (indexCurrent >= this.filteredImages.length)
      {
        return;
      }
      this.imagesDisplayBottomRow.push(this.filteredImages[indexCurrent]);
    }
  }

  nextPage(): void {
    this.imagesDisplayTopRow = [];
    this.imagesDisplayBottomRow = [];
    document.getElementById(`page${this.currentPage}`)?.classList.remove('active');
    this.currentPage++;
    document.getElementById(`page${this.currentPage}`)?.classList.add('active');
    this.disableButtons();
    this.divideImages();
  }

  previousPage(): void {
    this.imagesDisplayTopRow = [];
    this.imagesDisplayBottomRow = [];
    document.getElementById(`page${this.currentPage}`)?.classList.remove('active');
    this.currentPage--;
    document.getElementById(`page${this.currentPage}`)?.classList.add('active');
    this.disableButtons();
    this.divideImages();
  }

  disableButtons(): void {
    if (this.filteredImages == undefined) {
      document.getElementById("nextButton")?.classList.add('disabled');
      document.getElementById("previousButton")?.classList.add('disabled');
      return;
    }

    if (this.currentPage > 1) {
      document.getElementById("previousButton")?.classList.remove('disabled');
    }
    else {
      document.getElementById("previousButton")?.classList.add('disabled');
    }
    if (this.totalImages <= this.currentPage * this.imagesPerPage){
      document.getElementById("nextButton")?.classList.add('disabled');
    }
    else {
      document.getElementById("nextButton")?.classList.remove('disabled');
    }
  }

  moveToPage(pageNum: number): void {
    this.imagesDisplayTopRow = [];
    this.imagesDisplayBottomRow = [];
    document.getElementById(`page${this.currentPage}`)?.classList.remove('active');
    this.currentPage = pageNum;
    document.getElementById(`page${pageNum}`)?.classList.add('active');
    this.disableButtons();
    this.divideImages();
  }

  filterChartType(chartType: string){
    this.chartTypeFilter = chartType;
    this.updateFilters();
  }

  filterHasChart(hasCharts: string): void {
    this.hasChartFilter = hasCharts;
    if (this.hasChartFilter == 'Without')
      this.chartTypeFilter = 'Any'
    this.updateFilters();
  }

  filterMultiPanel(multiPanel: string): void {
    this.multiPanelFilter = multiPanel;
    if (multiPanel == 'Multi')
      this.chartTypeFilter = 'Any'
    this.updateFilters();
  }

  updateFilters(): void {
    var chartFilteredImages: ImageValidation[] = [];
    if (this.chartTypeFilter == 'Any'){ //ver todo
      chartFilteredImages = this.imagesToValidate;
    }
    else {
      chartFilteredImages = this.imagesToValidate.filter((image: ImageValidation) =>
        image.chartClass == this.chartTypeFilter);
    }
    
    var hasChartFilteredImages: ImageValidation[] = [];
    if(this.hasChartFilter == 'Any'){ //ver todo
      hasChartFilteredImages = this.imagesToValidate;
    }
    else if(this.hasChartFilter == 'With'){
      hasChartFilteredImages = this.imagesToValidate.filter((image: ImageValidation) => image.hasChart);
    }
    else if (this.hasChartFilter == 'Without'){
      hasChartFilteredImages = this.imagesToValidate.filter((image: ImageValidation) => !image.hasChart);
    }

    var panelFilteredImages: ImageValidation[] = []
    if(this.multiPanelFilter == 'Any'){ //ver todo
      panelFilteredImages = this.imagesToValidate;
    }
    if (this.multiPanelFilter == 'Multi'){
      panelFilteredImages = this.imagesToValidate.filter((image: ImageValidation) => image.multiPanel);
    }
    else if(this.multiPanelFilter == 'Single'){
      panelFilteredImages = this.imagesToValidate.filter((image: ImageValidation) => !image.multiPanel);
    }

    this.filteredImages = chartFilteredImages.filter(image => 
      hasChartFilteredImages.includes(image) && panelFilteredImages.includes(image));
    this.totalImages = this.filteredImages.length;
    this.pages = []
    for (let i = 0; i < Math.ceil(this.totalImages / this.imagesPerPage); i++) {
      this.pages.push([`page${i + 1}`, i + 1]);
    }
    this.moveToPage(1);
  }

  acceptImages(images: ImageValidation[]): void{
    var updates: any = {};
    var removes: any = {};
    
    images.forEach(image => {
      let chartValidated: ChartValidated = {
        score: 0,
        preClass: '',
        chartClass: '',
        hasChart: false,
        multiPanel: false,
        assignTo: '',
        validate_by: ''
      }
      const index = this.imagesToValidate.indexOf(image as ImageValidation, 0);
      this.imagesToValidate.splice(index, 1);
      image.imageName = image.imageName.split('.').join('&');
      chartValidated.score = image.score;
      if (image.n_reject == null || image.n_reject == undefined){
        chartValidated.n_reject = 0;
      } 
      else {
        chartValidated.n_reject = image.n_reject;
      }
      if(image.ext != null || image.ext != undefined){
        chartValidated.ext = image.ext;
      }
      chartValidated.preClass = image.preClass;
      chartValidated.chartClass = image.chartClass;
      chartValidated.hasChart = image.hasChart;
      chartValidated.multiPanel = image.multiPanel;
      chartValidated.assignTo = image.assignTo;
      chartValidated.validate_by = this.user.username;
      updates['/validated/' + image.imageName] = chartValidated;
      removes[`/annotated/${image.imageName}`] = null;
    })
    if (images.length > 0){
      this.updateImages(updates, removes);
    }
  }

  rejectImages(images: ImageValidation[]): void{
    var updates: any = {};
    var removes: any = {};
    var queryUpdate: string, queryRemove: string;

    images.forEach(image => {
      var chart: any = {};
      image.imageName = image.imageName.split('.').join('&');
      queryRemove = `/annotated/${image.imageName}`;
      if (image.n_reject == null || image.n_reject == undefined || image.n_reject == 0) { //first time rejecting
        let user = this.annotators.find(user => user.username == image.assignTo);
        queryUpdate = `/assigned/${user.id}/${image.imageName}`;
        chart.n_reject = 1;
        chart.preClass = image.preClass;
      }
      else { //second or more
        queryUpdate = `/available/${image.preClass}/${image.imageName}`
        chart.n_reject = image.n_reject + 1;
      }
      chart.score = image.score;
      if (image.ext != undefined || image.ext != null){
        chart.is_jpeg = image.ext;
      }
      const index = this.imagesToValidate.indexOf(image as ImageValidation, 0);
      this.imagesToValidate.splice(index, 1);
      updates[queryUpdate] = chart;
      removes[queryRemove] = null;
    })
    if (images.length > 0){
      this.updateImages(updates, removes);
    }
  }

  resetImages():void {
    this.filteredImages = this.imagesToValidate;
    this.totalImages = this.filteredImages.length;
    this.pages = []
    for (let i = 0; i < Math.ceil(this.totalImages / this.imagesPerPage); i++) {
      this.pages.push([`page${i + 1}`, i + 1]);
    }
    this.imagesDisplayTopRow = [];
    this.imagesDisplayBottomRow = [];
    //this.currentPage = 1;
    //this.chartTypeFilter = 'Any'
    this.divideImages();
    this.disableButtons();
    this.updateFilters();
  }

  updateImages(updates: any, removes: any){
    const db = getDatabase();
    update(ref(db), updates) //adding to validated
    .then(() => {
      update(ref(db), removes); //removing from annotated
      this.resetImages();
      this.toastr.success('Successful validation');
    })
    .catch((error) => {
      this.toastr.error(`${error}`, 'Unsuccessful validation')
    });
  }

}
