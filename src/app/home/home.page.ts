import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PokeapiService } from '../services/pokeapi.service';
import { CardInfoComponent } from '../components/card-info/card-info.component';
import { IonHeader, IonToolbar, IonContent, IonItem, IonInput, IonIcon, IonSpinner} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { searchOutline, radioButtonOnOutline, radioButtonOffOutline } from 'ionicons/icons';

interface PokemonsData {
  name: string;
  url: string;
}

interface PokemonCard {
  id: string;
  name: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FormsModule, CommonModule, IonHeader, IonToolbar, IonContent,IonSpinner, IonItem, IonInput, IonIcon, CardInfoComponent],
})

export class HomePage implements OnInit{
  search: string = '';
  loading: boolean = false;
  searchError: boolean = false;
  allPokemons: PokemonCard[] = [];
  filteredPokemons: PokemonCard[] = [];
  
  favorites: Set<string> = new Set();
  showFavoritesOnly: boolean = false;

  constructor(private pokeapi: PokeapiService) {
    addIcons({ searchOutline, radioButtonOnOutline, radioButtonOffOutline })
  } 

  isFavorite(pokemonId: string): boolean { return this.favorites.has(pokemonId) }

  ngOnInit() {
    const saved = localStorage.getItem('favoritePokemons');
    this.favorites = new Set(saved ? JSON.parse(saved) : []);

    this.pokeapi.getPokemons(10).subscribe((res) => {
      const resultados = res.results;

      this.allPokemons = resultados.map((p:PokemonsData)=>{
        const pokemonId = p.url.split('/').filter(Boolean).pop();

        return {
          id: pokemonId!,
          name: p.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
        }
      });

      this.filteredPokemons = [...this.allPokemons];
    })
  }

  toggleFavorite(pokemonId: string) {
    if (this.favorites.has(pokemonId)) {
      this.favorites.delete(pokemonId);
    } else {
      this.favorites.add(pokemonId);
    }
    localStorage.setItem('favoritePokemons', JSON.stringify(Array.from(this.favorites)));
  }
  
  toggleFavoritesFilter() {
    this.showFavoritesOnly = !this.showFavoritesOnly;

    let list = [...this.allPokemons];
    const pokemonSearched = this.search.toLowerCase().trim();

    if (this.showFavoritesOnly) { list = list.filter(p => this.favorites.has(p.id))}
    if (pokemonSearched) { list = list.filter(p => p.name.includes(pokemonSearched))}

    this.filteredPokemons = list;
  }
  
  searchByPokemon() {
    const pokemonSearched = this.search.toLowerCase().trim();

    if (!pokemonSearched) {
      if(!this.showFavoritesOnly){this.filteredPokemons = [...this.allPokemons]}
      this.searchError = false;
      return;
    }

    this.loading = true;
    this.searchError = false;

    this.pokeapi.getPokemon(pokemonSearched).subscribe({
      next: (res) => {
        this.filteredPokemons = [{
          id: res.id.toString(),
          name: res.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${res.id}.png`,
        }];
        this.loading = false;
      },
      error: () => {
        this.filteredPokemons = [];
        this.searchError = true;
        this.loading = false;
      }
    });
  }
}
