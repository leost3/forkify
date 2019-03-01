import Search from './models/Search';
import Recipe from './models/Recipe'
import List from './models/List'
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {elements, renderLoader, clearLoader} from './views/base';
// * Global state of the app
// * - Search object
// * - Current recipe object
// * - Shopping list object
// * - Liked recipes



const state = {};
// SEARCH CONTROLLER
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();
    // const query = 'pizza';  -> testing
    if (query) {
        // 2) New search object and add to state;
        state.search = new Search(query);
        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try{
            // 4) Search for recipes
            await state.search.getResults();
        }catch(error) {
            console.log(error);
        }
        // 5) Render results in UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}



elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });

elements.searchResPage.addEventListener('click', e => {
    const btn = e.target.closest(".btn-inline")
    
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        console.log(goToPage)
        searchView.clearResults()
        searchView.renderResults(state.search.result,goToPage);
        // console.log(goToPage)
    }
});

// RECIPE CONTROLLER

const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#','');
    if (id) {
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe)

        // Create new Recipe object
        state.recipe = new Recipe(id);

        // Highlight selected search item
        searchView.highlightSelected(id);
        
        // window.r = state.recipe; --> Testing
        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServing();
        }catch(error) {
            console.log(error);
        }

        //calculate servings and time

        // Render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe);
        // console.log(state.recipe);
    }
}


window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease when button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe)
        }
    }else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Decrease when button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe)
    }
    console.log(state.recipe)
});


window.l = new List();













//TEST LIMIT
// async function getResults() {
//     try {
//         const res = await fetch(`https://www.food2fork.com/api/search?key=39db77182b993b7eb2f3ff7981a60b45&q=$pizza`);
//         const result = await res.json();
//         console.log(result);
//     }catch(err) {
//         alert(err)
//     }
//  }