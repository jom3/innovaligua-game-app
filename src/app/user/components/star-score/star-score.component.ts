import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'star-score',
  standalone: true,
  imports: [],
  templateUrl: './star-score.component.html',
  styleUrl: './star-score.component.css'
})
export class StarScoreComponent {
  @Input({required:true}) score!:any;
  public stars = signal<string[]>(['empty-star','empty-star','empty-star'])

  ngOnInit(): void {
    this.getStars(Number(this.score))
  }

  getStars(totalScore:number){
    if(totalScore>=60){
      this.stars.set(['filled-star','empty-star','empty-star'])
    }
    if(totalScore>=75){
      this.stars.set(['filled-star','filled-star','empty-star'])
    }
    if(totalScore==100){
      this.stars.set(['filled-star','filled-star','filled-star'])
    }
  }
}
