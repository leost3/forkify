import Search from './models/Search';
import {elements} from './views/base';
import * as searchView from './views/searchView';



/*Global state of the app 
*  - Search object
*  - Current recipe object
*  - Shopping list object
*  - linked recipes
*/
const state = {};




const controlSearch = async () => {
    //1) Get query from view
    const query = searchView.getInput();
    // searchView.getInput();

    if (query) {
        //2) New search object and add to state
        state.search = new Search(query);
        
        //3) Prepare UI for results
        
        //4) Search for recipes
        await state.search.getResults();
        
        //5) Render results on UI
        console.log(state.search.result);
        searchView.renderResults(state.search.result);
        console.log()
    }    
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})


// elements.searchForm