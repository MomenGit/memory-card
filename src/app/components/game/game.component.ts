import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GameService } from '../../services/game.service';
import { IGameRecord } from '../../models/igame-record';
import { IPokemon } from '../../models/ipokemon';
import { PokeCardComponent } from '../poke-card/poke-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Level } from '../../models/level.type';

@Component({
  selector: 'app-game',
  imports: [PokeCardComponent, RouterLink],
  providers: [GameService],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  private _gameService = inject(GameService);
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);

  gameRecord!: IGameRecord;
  currentScore!: number;
  shuffledPokemons!: IPokemon[];
  timer!: number;
  gameState: 'win' | 'lose' | null = null;
  endMessage!: string;
  @ViewChild('myModal') modal!: ElementRef<HTMLDialogElement>;

  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe((res) => {
      console.log(res);
      this._gameService.initializeLevel();
    });
    this.gameRecord = this._gameService.gameRecord;
    this._gameService.showedPokemons$.subscribe((res) => {
      this.shuffledPokemons = res;
    });
    this._gameService.score$.subscribe((res) => {
      this.currentScore = res;
    });
    this._gameService.timer$.subscribe((res) => {
      this.timer = res;
    });
    this._gameService.gameState$.subscribe((res) => {
      this.gameState = res;
      this.showEndGameModal();
    });
    this._gameService.endMessage$.subscribe((res) => {
      this.endMessage = res;
    });
  }
  turn(pokemonId: string) {
    this._gameService.playTurn(pokemonId);
  }
  showEndGameModal() {
    if (this.gameState) {
      console.log(this.gameState);
      this.modal.nativeElement.showModal();
    }
  }
  restartGame() {
    this._router
      .navigateByUrl('/', { skipLocationChange: true, replaceUrl: true })
      .then(() =>
        this._router.navigate(['/game'], {
          queryParams: {
            difficulty: this.gameRecord.difficulty,
            level: this.gameRecord.level,
          },
        })
      );
  }
  toNextLevel() {
    this.gameRecord.level = (+this.gameRecord.level + 1) as Level;
    this._router
      .navigateByUrl('/', { skipLocationChange: true, replaceUrl: true })
      .then(() =>
        this._router.navigate(['/game'], {
          queryParams: {
            difficulty: this.gameRecord.difficulty,
            level: this.gameRecord.level,
          },
        })
      );
  }
  quitGame() {
    this._gameService.endGame(null, '');
    this._router.navigateByUrl('/');
  }
}
