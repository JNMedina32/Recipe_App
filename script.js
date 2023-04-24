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
const userInput = document.querySelector('#userInput').value;
const savedRecipes = document.querySelector('#savedRecipes');

//grabs the form key and values pairs
const formEl = document.querySelector('#recipeFilters');

//saves recipes to the side and local storage 

// savedRecipes.addEventListener('click', () => {
//     savedContainer.innerHTML += `
//     <div class='saves'>
//     <img src=${hits.recipe.recipe.images.THUMBNAIL.url}>
//     <h3>${hits.recipe.recipe.label}</h3>
//     </div>
//     `
// })
//saves recipes to the side and local storage 
const saveRecipe = () => {
    savedContainer.innerHTML += `
    <div class='saves'>
    <img src=${recipe.recipe.images.THUMBNAIL.url}>
    <h3>${this.recipe.recipe.label}</h3>
    </div>
    `
};



//function to dynamically display to html
function displayRecipes(hits){ 
    hits.forEach(recipe => {
        let calories = recipe.recipe.calories.toFixed(2);
        resultContainer.innerHTML += `
        <div class='individualRecipe'>
        <h3>${recipe.recipe.label}</h3>
        <img src=${recipe.recipe.images.SMALL.url}>
        <p class='calories'><strong>Calories: ${calories} Time: ${recipe.recipe.totalTime}</strong></p>
        <p>Ingredients: ${recipe.recipe.ingredientLines}</p>
        </div>
        <div class='prepAndSave'>
        <a href="${recipe.recipe.url}" target='_blank' class='buttons'>How to Prepare</a> <div class='buttons' id='savedRecipes' onclick='saveRecipe()'>Save Recipe</div>
        </div>
        `;  
    })
};



//grabs filters then fetches
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
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
                }
            }
        }catch(error){
            console.log(error);
        }
    };
    submitBtn();
});

const getRecipeByDish = async (name) => {
    const specificDish = `q=${name}`;
    const urlToFetchByDish = `${baseURL}&${specificDish}&${appID}&${appKey}`;
    try{
        const repsonse = await fetch(urlToFetchByDish);
        if(repsonse.ok){
            const jsonResponse = await repsonse.json();
            const hits = jsonResponse.hits;
            console.log(jsonResponse)
            console.log(hits[0])
            console.log(hits[0]['recipe']['label'])
        }
    }catch(error){
        console.log(error);
    };
};

