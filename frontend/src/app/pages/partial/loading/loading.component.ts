import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  isLoading!:Observable<Boolean>
  constructor(private loadingService:LoadingService) {
    this.isLoading = this.loadingService.isLoading
  }

  ngOnInit(): void {

  }

}
