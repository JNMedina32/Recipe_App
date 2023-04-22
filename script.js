console.log('Running Recipe App')
//Variables for the fetch
const baseURL = `https://api.edamam.com/api/recipes/v2?type=public`;
const appID = ``;
const appKey = ``;
const urlToFetch = `${baseURL}&${appID}&${appKey}`;

//variables for dynamic html
const resultContainer = document.querySelector('.resultContainer');
const submitButton = document.querySelector('#submitBtn');

//grabs the form key and values 
const formEl = document.querySelector('#recipeFilters');

//function to dynamically display to html
function displayRecipes(hits){
    hits.forEach(recipe => {
        resultContainer.innerHTML += `
        <h3>${recipe.recipe.label}</h3>
        <img src=${recipe.recipe.images.SMALL.url}>
        `;
    })
}

//grabs filters then fetches
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const paramArray = [];
    for (let i = 0; i < formEl.elements.length; i++){
        var e = formEl.elements[i];
        if(e.value != 'any'){
        paramArray.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value));
        }
    };
    const queryStrings = paramArray.join('&');
    console.log(queryStrings);
    async function submitBtn(){
        const fetchURL = `${urlToFetch}&${queryStrings}`;
        try{
            const response = await fetch(fetchURL);
            if(response.ok){
                const jsonResponse = await response.json();
                const hits = jsonResponse.hits;
                console.log(jsonResponse);
                console.log(hits);
                if(hits.length < 1){
                    resultContainer.innerHTML = `I apologize. Looks like there are no recipes that match your filters in this database <strong>:(</strong>`
                }else {
                    resultContainer.innerHTML = ``;
                    hits.forEach(recipe => {
                        resultContainer.innerHTML += `
                        <h3>${recipe.recipe.label}</h3>
                        <img src=${recipe.recipe.images.SMALL.url}>
                        `;
                    })
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

// console.log(submitBtn())