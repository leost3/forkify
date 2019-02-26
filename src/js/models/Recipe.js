import axios from 'axios';
import {key} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title =  res.data.recipe.title;
            this.author =  res.data.recipe.publisher;
            this.img =  res.data.recipe.image_url;
            this.url =  res.data.recipe.source_url;
            this.ingredients =  res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods*15;
    }

    calcServing() {
        this.servings = 4;
    }

    parseIngredients() {
        
        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds']
        const unitsShort = ['tbps','tbsp','oz','oz','tsp','tsp','cup','pound']
        
        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit,i) => {
                ingredient = ingredient.replace(unit,unitsShort[i]);
            });

            ingredient = ingredient.replace(/ *\([^)] */g, ' ');

            return ingredient;
        });

        this.ingredients = newIngredients;
    }
}