import Search from './models/Search';
import Recipe from './models/Recipe'
import * as searchView from './views/searchView';
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

    if (query) {
        // 2) New search object and add to state;
        state.search = new Search(query);
        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes)
        // 4) Search for recipes
        await state.search.getResults();
        // 5) Render results in UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}



elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPage.addEventListener('click', e => {
    const btn = e.target.closest(".btn-inline")
    console.log(btn);
    // const btn = e.target.closest('.btn-inline');
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

        // Create new Recipe object
        state.recipe = new Recipe(id);
        // Get recipe data
        await state.recipe.getRecipe();

        //calculate servings and time

        // Render recipe
    }
}


window.addEventListener('hashchange', controlRecipe);
