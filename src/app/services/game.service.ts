import { inject, Injectable } from '@angular/core';
import { PokeApiService } from './poke-api.service';
import { IGameRecord } from '../models/igame-record';
import { Difficulty, difficultyCardsNoMap } from '../models/difficulty.type';
import { ActivatedRoute } from '@angular/router';
import { IPokemon } from '../models/ipokemon';
import { Level, levelTimeMap } from '../models/level.type';
import { BehaviorSubject, Subject } from 'rxjs';
import { shuffleArray } from '../utils/shuffle.util';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _pokeApiService = inject(PokeApiService);
  private _activatedRoute = inject(ActivatedRoute);
  private _storageService = inject(StorageService);

  gameRecord!: IGameRecord;
  pokemons!: IPokemon[];
  selectedPokemons!: Set<string>;
  timerInterval!: any;
  startTime!: any;

  score$ = new BehaviorSubject<number>(0);
  showedPokemons$ = new BehaviorSubject<IPokemon[]>([]);
  selectedPokemons$ = new BehaviorSubject<Set<string>>(new Set<string>());
  timer$ = new BehaviorSubject<number>(0);
  gameState$ = new Subject<'win' | 'lose' | null>();
  endMessage$ = new Subject<string>();

  constructor() {}

  initializeLevel() {
    let difficulty =
      (this._activatedRoute.snapshot.queryParamMap.get(
        'difficulty'
      ) as Difficulty) ?? ('easy' as Difficulty);
    let level = (this._activatedRoute.snapshot.queryParamMap.get('level') ??
      1) as Level;
    this.startTime = Date.now();
    this.gameRecord = {
      id: `${Math.random() * 100}`,
      difficulty: difficulty,
      score: 0,
      totalTime: 0,
      level: level,
      date: new Date(),
    };

    this.selectedPokemons = new Set<string>();
    let limit = difficultyCardsNoMap[this.gameRecord.difficulty][1];
    let offset =
      difficultyCardsNoMap[this.gameRecord.difficulty][1] *
      this.gameRecord.level;
    this._pokeApiService.getPokemons(limit, offset).subscribe({
      next: (res) => {
        this.pokemons = res;
        this.processLevel();
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.gameState$.next(null);
    this.gameState$.subscribe({
      next: (state) => {
        this.gameRecord.score = this.score$.getValue();
        this.gameRecord.totalTime = Date.now() - this.startTime;
        this.gameRecord.state = state;
        this._storageService.addRecord(this.gameRecord);
      },
    });
  }

  processTime() {
    this.timer$.next(levelTimeMap[this.gameRecord.level]);
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.timer$.getValue() === 0) {
        if (!this.gameRecord.state) {
          this.endGame('lose', 'You lost as the timer ended.');
        }
        clearInterval(this.timerInterval);
      } else {
        this.timer$.next(this.timer$.getValue() - 1);
      }
    }, 1000);
  }

  processTurn() {
    this.showedPokemons$.next(
      shuffleArray(this.pokemons).slice(
        0,
        difficultyCardsNoMap[this.gameRecord.difficulty][0]
      )
    );
    this.processTime();
  }

  endGame(state: 'win' | 'lose' | null, msg: string) {
    clearInterval(this.timerInterval);
    if (state === 'win') this.gameState$.next('win');
    else this.gameState$.next('lose');
    this.endMessage$.next(msg);
  }

  processLevel() {
    if (
      this.score$.getValue() ===
      difficultyCardsNoMap[this.gameRecord.difficulty][0]
    ) {
      this.endGame('win', 'Congratulations you won.');
    } else {
      this.processTurn();
    }
  }

  playTurn(pokemonId: string) {
    if (this.selectedPokemons.has(pokemonId)) {
      this.endGame(
        'lose',
        `You lost as you selected ${
          this.pokemons.filter((p) => p.id === pokemonId)[0].name
        } twice.`
      );
    } else {
      this.selectedPokemons.add(pokemonId);
      this.score$.next(this.score$.getValue() + 1);
      this.processLevel();
    }
  }

  proceedLevel() {}
}
