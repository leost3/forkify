import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';
// * Global state of the app
// * - Search object
// * - Current recipe object
// * - Shopping list object
// * - Liked recipes



const state = {};
window.state = state;


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
        // console.log(state.recipe)
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        // console.log(state.recipe);
    }
}


// List Controller

const controlList = () => {
    // Create new list of there in none yet
    if (!state.list) state.list = new List();
    console.log(state);
    // Add new ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}
// LIKE CONTROLLER






window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);


// Handling delete and update list items events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    console.log(e.target)

    // Handle delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        console.log('matched delete')
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});




const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    // USer has not yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
        // Toggle the like button
        likesView.toggleLikeBtn(true);
        // Add like to UI list
        likesView.renderlike(newLike);
        
        //  User has liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);
        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like to UI list
        likesView.deleteLike(currentID); 
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes())
}

// Restore liked recipes 
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();
    
    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes())

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderlike(like))
})



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
    }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingredients to shopping List
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});














// //TEST LIMIT
// const key = '39db77182b993b7eb2f3ff7981a60b45'; //leost3
// const key = '52ac8fe51914f04bb72dac3a9da13ec3 '; // leomontreala2
// const key = 'ef637c6941e34e3e23e7390dc027a7f7  '; //webdevlasalle
// async function getResults() {
//     try {
//         const res = await fetch(`https://www.food2fork.com/api/search?key=39db77182b993b7eb2f3ff7981a60b45&q=$pizza`);
//         const result = await res.json();
//         console.log(result);
//     }catch(err) {
//         alert(err)
//     }
//  }