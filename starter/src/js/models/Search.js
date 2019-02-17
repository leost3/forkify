import axios from 'axios';


// 
export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults(query) {
        const key = '39db77182b993b7eb2f3ff7981a60b45';
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}