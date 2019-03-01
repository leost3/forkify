import axios from 'axios';
import {key} from '../config';

export default class Search {
    constructor (query) {
        this.query = query;
    }

    async getResults() {
        try {
            const cors = 'https://api.codetabs.com/v1/proxy?quest=';
            const res = await axios(`${cors}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this);
        }catch(err) {
            alert(err)
        }
     }
     
}


