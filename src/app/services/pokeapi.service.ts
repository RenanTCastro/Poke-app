import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  getPokemons(limit = 6, offset = 0): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemon(pokemon: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pokemon/${pokemon}`);
  }
}
