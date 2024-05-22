import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {
  Component,
  Inject,
  Input,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { WordService } from '../../services/word.service';
import { ActivityService } from '../../services/activity.service';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';
import { StarScoreComponent } from '../../components/star-score/star-score.component';
import { Activity } from '../../interfaces/activity.interface';

interface DialogData{
  totalWords:number,
  wordsFound:number,
  currentId:string
}

interface ScoreData{
  totalScore:number,
  currentId:string
}

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [MatDialogModule,StarScoreComponent],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.css',
})

export default class GamePageComponent implements OnInit {
  @Input('id') id!: string;

  public act = signal<Activity>({
    attempts:0,
    created_at: new Date(),
    id:'',
    max_score:0,
    state:1,
    type:'',
    userId:''
  });
  public score = signal<number>(this.act().max_score)

  private wordSvc = inject(WordService);
  private activitySvc = inject(ActivityService);
  public dialog = inject(MatDialog)

  words: string[] = [];
  gridSize: number = 10;
  wordGrid!: string[][];
  currentSelection: number[] = [];
  wordsFound: string[] = [];

  ngOnInit(): void {
    this.getActivity(this.id);
    this.getAllWords();
    this.startNewGame();
  }

  comprobar() {
    const dialogRef = this.dialog.open(GameDialog,{
      data:{totalWords:this.words.length, wordsFound:this.wordsFound.length, currentId:this.id},
      disableClose:true
    });
  }

  getActivity(id: string) {
    this.activitySvc.getActivity(id).subscribe({
      next: (r) => {
        this.act.set(r);
      },
      error: (e) => console.log(e),
      complete:()=>{
        this.score.set(this.act().max_score)
      }
    });
  }

  getAllWords() {
    this.wordSvc.getAllWord().subscribe({
      next: (r) => {
        r.map((word) => this.words.push(word.word.toUpperCase()));
        this.renderWordsList(this.words);
        this.placeWordsInGrid(this.words, this.wordGrid);
        this.renderGrid(this.wordGrid);
      },
    });
  }

  startNewGame(): void {
    this.wordGrid = this.generateEmptyGrid(this.gridSize);
    this.currentSelection = [];
    this.wordsFound = [];
  }

  generateEmptyGrid(size: number): string[][] {
    return Array(size)
      .fill(null)
      .map(() => Array(size).fill('_'));
  }

  placeWordsInGrid(words: string[], grid: string[][]): void {
    words.forEach((word) => {
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * this.gridSize);
        const col = Math.floor(Math.random() * (this.gridSize - word.length));
        if (this.canPlaceWordAt(word, grid, row, col)) {
          for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i];
          }
          placed = true;
        }
      }
    });
  }

  canPlaceWordAt(
    word: string,
    grid: string[][],
    row: number,
    col: number
  ): boolean {
    for (let i = 0; i < word.length; i++) {
      if (grid[row][col + i] !== '_') return false;
    }
    return true;
  }

  renderGrid(grid: string[][]): void {
    const container = document.getElementById('wordSearchContainer');
    if (container) {
      container.innerHTML = '';
      grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const cellElement = document.createElement('div');
          cellElement.textContent =
            cell === '_'
              ? String.fromCharCode(65 + Math.floor(Math.random() * 26))
              : cell;
          cellElement.dataset['index'] = (
            rowIndex * this.gridSize +
            colIndex
          ).toString();
          cellElement.addEventListener('click', () =>
            this.selectCell(rowIndex, colIndex, cellElement)
          );
          container.appendChild(cellElement);
        });
      });
    }
  }

  renderWordsList(words: string[]): void {
    const wordsListContainer = document.getElementById('wordsList');
    if (wordsListContainer) {
      wordsListContainer.innerHTML = '';
      words.forEach((word) => {
        const wordElement = document.createElement('img');
        wordElement.src = `http://localhost:3000/api/words/file/${word}.jpeg`
        wordElement.width=100
        wordElement.height=100
        wordElement.textContent = word;
        wordElement.setAttribute('data-word', word);
        wordsListContainer.appendChild(wordElement);
      });
    }
  }

  selectCell(
    rowIndex: number,
    colIndex: number,
    cellElement: HTMLElement
  ): void {
    const index = rowIndex * this.gridSize + colIndex;
    if (this.currentSelection.includes(index)) return;
    cellElement.classList.add('selected');
    this.currentSelection.push(index);

    const selectedWord = this.currentSelection
      .map((idx) => {
        const row = Math.floor(idx / this.gridSize);
        const col = idx % this.gridSize;
        return this.wordGrid[row][col];
      })
      .join('');

    if (
      this.words.includes(selectedWord) &&
      !this.wordsFound.includes(selectedWord)
    ) {
      this.wordsFound.push(selectedWord);
      this.currentSelection.forEach((idx) => {
        const element = document.querySelector(`[data-index="${idx}"]`);
        if (element) {
          element.classList.add('found');
        }
      });

      const wordElement = document.querySelector(
        `[data-word="${selectedWord}"]`
      );
      if (wordElement) {
        wordElement.classList.add('found');
      }
      this.currentSelection = [];
    } else if (!this.words.some((word) => word.startsWith(selectedWord))) {
      this.currentSelection.forEach((idx) => {
        const element = document.querySelector(`[data-index="${idx}"]`);
        if (element) {
          element.classList.remove('selected');
        }
      });
      this.currentSelection = [];
    }
  }
}

@Component({
  selector: 'score-dialog',
  templateUrl: 'score-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, StarScoreComponent],
})
export class ScoreDialog {
  score:any;

  private activitySvc = inject(ActivityService)
  private location = inject(Location)

  constructor(@Inject(MAT_DIALOG_DATA) public data: ScoreData) {
    this.score = data.totalScore
  }

  checkActivity(id:string, score:number){
    this.activitySvc.checkActivity(id,score).subscribe({
      next:r=>{
        this.location.back()
      }
    })
  }

}

@Component({
  selector: 'game-dialog',
  templateUrl: 'game-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})

export class GameDialog {
  result:number;
  totalScore: number;
  public dialog = inject(MatDialog)
  private activitySvc = inject(ActivityService)
  private location = inject(Location)

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.result = data.totalWords - data.wordsFound
    this.totalScore = Math.round((data.wordsFound*100)/data.totalWords)
  }

  checkActivity(id:string, score:number){
    this.activitySvc.checkActivity(id,score).subscribe({
      next:r=>{
        this.location.back()
      }
    })
  }

  scoreDialog() {
    const dialogRef = this.dialog.open(ScoreDialog,{
      data:{totalScore:this.totalScore, currentId:this.data.currentId},
      disableClose:true
    });
  }
}
