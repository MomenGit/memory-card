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
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game',
  imports: [PokeCardComponent, RouterLink],
  providers: [GameService],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  private _gameService: GameService = inject(GameService);
  gameRecord!: IGameRecord;
  currentScore!: number;
  shuffledPokemons!: IPokemon[];
  timer!: number;
  gameState: 'win' | 'lose' | null = null;
  @ViewChild('myModal') modal!: ElementRef<HTMLDialogElement>;

  ngOnInit(): void {
    this._gameService.initializeLevel();
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
    });
  }
  turn(pokemonId: string) {
    this._gameService.playClick(pokemonId);
    if (this.gameState !== null) {
      console.log(this.gameState);
      this.modal.nativeElement.showModal();
    }
  }
}
