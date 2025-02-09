import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScoreBoardComponent } from '../score-board/score-board.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ScoreBoardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
