import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ScoreBoardComponent } from '../score-board/score-board.component';

@Component({
  selector: 'app-home',
  imports: [ScoreBoardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private _router = inject(Router);
  navigate(difficulty: string, level: number) {
    this._router.navigate(['/game'], {
      queryParams: { difficulty, level },
    });
  }
}
