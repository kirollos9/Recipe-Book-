import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authSrv: AuthService
  ) {}
  private token: string;
  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://ng-complete-guide-bf14a-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://ng-complete-guide-bf14a-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
    // return this.authSrv.user.pipe(take(1),exhaustMap(user=>{
    //   return this.http
    //   .get<Recipe[]>(
    //     'https://ng-complete-guide-bf14a-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
    //     {
    //       params:new HttpParams().set('auth',user.token)
    //     }
    //   )
    // }),map(recipes => {
    //   return recipes.map(recipe => {
    //     return {
    //       ...recipe,
    //       ingredients: recipe.ingredients ? recipe.ingredients : []
    //     };
    //   });
    // }),
    // tap(recipes => {
    //   this.recipeService.setRecipes(recipes);
    // }));
  }
}
