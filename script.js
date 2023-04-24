console.log('Running Recipe App')
//Variables for the fetch
const baseURL = `https://api.edamam.com/api/recipes/v2?type=public`;
const appID = ``;
const appKey = ``;
const urlToFetch = `${baseURL}${appID}${appKey}`;

//variables for dynamic html
const resultContainer = document.querySelector('.resultContainer');
const submitButton = document.querySelector('#submitBtn');
const filterContainer = document.querySelector('.filterContainer');


const savedContainer = document.querySelector('.savedContainer');
const refilterBtn = document.querySelector('.refilterButton')
const contentDiv = document.querySelector('.content');

//grabs the form key and values pairs
const formEl = document.querySelector('#recipeFilters');

//each recipe result assumes this class
class Recipe {
    constructor(recipe){
        this._label = recipe.recipe.label;
        this._calories = recipe.recipe.calories.toFixed(2);
        this._imgSmall = recipe.recipe.images.SMALL.url;
        this._imgThumb = recipe.recipe.images.THUMBNAIL.url;
        this._ingredients = recipe.recipe.ingredientLines;
        this._prep = recipe.recipe.url;
        this._time = recipe.recipe.totalTime;
    }
    get label(){return this._label}
    get calories(){return this._calories}
    get imgSmall(){return this._imgSmall}
    get imgThumb(){return this._imgThumb}
    get ingredients(){return this._ingredients}
    get prep(){return this._prep}
    get time(){return this._time}


    saveRecipe(recipe){
        
        let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')); 
        if(!savedRecipes){
            savedRecipes = [];
        }
        savedRecipes.push({
            label: this.label,
            imgThumb: this.imgThumb
        });  
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    };

    displayRecipe(){

        resultContainer.innerHTML += `
        <div class='individualRecipe'>
        <h3>${this.label}</h3>
        <img src=${this.imgSmall}>
        <p class='calories'><strong>Calories: ${this.calories} Time: ${this.time}</strong></p>
        <p>Ingredients: ${this.ingredients}</p>
        </div>
        <div class='prepAndSave'>
        <a href="${this.prep}" target='_blank' class='buttons'>How to Prepare</a> 
        <div class='buttons save-recipe' id='savedRecipes'>Save Recipe</div>
        </div>
        `;
        const saveButtons = document.querySelectorAll('.save-recipe');

        saveButtons.forEach(saveButton => {
            saveButton.addEventListener('click', () => {
                const savedRecipe = document.createElement('div');
                savedRecipe.className = 'savedRecipe';
                savedRecipe.innerHTML = `
                <h4>${this.label}</h4>
                <img src=${this.imgThumb}>
                `;
                savedContainer.append(savedRecipe);
                this.saveRecipe(this);
            })
        })
    }
}
function hideFilter(){
    filterContainer.style.display = 'none';
    refilterBtn.style.display = 'inline-block';

}
function displayRecipes(hits){ 
    hits.forEach(recipe => {
        recipe = new Recipe(recipe);
        recipe.displayRecipe();
    })
};
refilterBtn.addEventListener('click', () => {
    filterContainer.style.display = '';
    refilterBtn.style.display = 'none';
    contentDiv.style.gap = '.5rem';
})




//grabs filters then fetches
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const userInput = document.querySelector('#userInput').value;
    const paramArray = [];
    for (let i = 0; i < formEl.elements.length; i++){
        var e = formEl.elements[i];
        if(e.value != 'any' && e.value != ''){
        paramArray.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value));
        }
    };

    const queryStrings = paramArray.join('&');

    async function submitBtn(){
        let fetchURL = `${urlToFetch}&${queryStrings}`;
        if(userInput){
            const userInputQueryString = `&q=${encodeURIComponent(userInput)}`;
            fetchURL = `${baseURL}${userInputQueryString}${appID}${appKey}&${queryStrings}`
        }
        try{
            const response = await fetch(fetchURL);
            if(response.ok){
                const jsonResponse = await response.json();
                const hits = jsonResponse.hits;
                if(hits.length < 1){
                    resultContainer.innerHTML = `I apologize. Looks like there are no recipes that match your filters in this database <strong>:(</strong>`
                }else {
                    resultContainer.innerHTML = ``;
                    displayRecipes(hits);
                    hideFilter();
                }
            }
        }catch(error){
            console.log(error);
        }
    };
    submitBtn();
});

window.addEventListener('load', () => {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes'));
    if(savedRecipes){
        savedRecipes.forEach(savedRecipe => {
            const savedRecipeDiv = document.createElement('div');
            savedRecipeDiv.className = 'savedRecipe';
            savedRecipeDiv.innerHTML = `
                <h4>${savedRecipe.label}</h4>
                <img src=${savedRecipe.imgThumb}>
            `;
            savedContainer.append(savedRecipeDiv);
        });
    }
});


