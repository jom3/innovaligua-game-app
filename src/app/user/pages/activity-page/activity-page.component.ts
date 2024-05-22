import { Component, OnInit, inject, signal } from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { ActivityService } from '../../services/activity.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Location, NgClass } from '@angular/common';
import { StarScoreComponent } from '../../components/star-score/star-score.component';
import { Activity } from '../../interfaces/activity.interface';

@Component({
  selector: 'app-activity-page',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatTooltipModule, NgClass,StarScoreComponent],
  templateUrl: './activity-page.component.html',
  styleUrl: './activity-page.component.css'
})

export default class ActivityPageComponent implements OnInit{

  private router = inject(Router)
  private activitySvc = inject(ActivityService)
  public activities = signal<Activity[]>([])


  ngOnInit() {
    this.getActivities()
  }

  getActivities(){
    this.activitySvc.getActivitiesByUser().subscribe({
      next:r=>{
        this.activities.set(r)
      },
      error:e=>console.log(e)
    })
  }

  goToGame(id:string){
    this.router.navigate(['/user/juego',id])
  }
}
