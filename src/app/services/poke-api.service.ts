import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IPokemon } from '../models/ipokemon';
import { IPokemonListResponse } from '../models/ipokemon-list-response';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  constructor(private _http: HttpClient) {}

  getPokemonsList(
    limit: number = 8,
    offset: number = 0
  ): Observable<IPokemonListResponse> {
    const url = `${environment.apiUrl}?limit=${limit}&offset=${offset}`;
    return this._http.get<IPokemonListResponse>(url);
  }

  getPokemonDetails(url: string): Observable<IPokemon> {
    return this._http.get<IPokemon>(url);
  }

  getPokemons(limit: number = 8, offset: number = 0): Observable<IPokemon[]> {
    return this.getPokemonsList(limit, offset).pipe(
      map((response) => response.results.map((result) => result.url)),
      switchMap((urls) =>
        forkJoin(urls.map((url) => this.getPokemonDetails(url)))
      )
    );
  }
}
