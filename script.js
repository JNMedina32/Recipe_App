console.log('Running Recipe App')
//Variables for the fetch
const baseURL = `https://api.edamam.com/api/recipes/v2?type=public`;
const appID = ``;
const appKey = ``;
const urlToFetch = `${baseURL}&${appID}&${appKey}`;

//variables for dynamic html
const resultContainer = document.querySelector('.resultContainer');
const imgContainer = document.querySelector('.imgContainer');
const firstImgTag = document.querySelector('.firstImg');

const submitButton = document.querySelector('#submitBtn');

//grabs the form key and values 
const formEl = document.querySelector('#recipeFilters');


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





//Grabbing the radio input for meal type
const mealType = document.getElementsByName('mealType');

const mealChecked = () => {
    for(var meal of mealType){
        if(meal.checked) {
            if(meal.value != 'Any'){
                return meal.value
            } else return;
        }
    }
}
//console.log(mealChecked());

//grabing the dropdown selection for Dish Type
const dishType = document.getElementById('dishType');
//console.log(dishType);

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
function dropdownSelection(dropdown){
    let dropdownList = dropdown;
    let selectedIndex = dropdownList.selectedIndex;
    let selectedOption = dropdownList.options[selectedIndex];
    return selectedOption.value;
} 
//dropdownSelection(dishType);
// async function submitBtn(){

//     const param = `&dishType=${paramArray[0]}`;
//     const fetchURL = `${urlToFetch}${param}`;
//     try{
//         const response = await fetch(fetchURL);
//         if(response.ok){
//             const jsonResponse = await response.json();
//             const hits = jsonResponse.hits;
//             const imgSrc = hits[0].recipe.images.THUMBNAIL.url;
//             firstImgTag.setAttribute('src', imgSrc);
//         }
//     }catch(error){
//         console.log(error);
//     }
// };
// console.log(submitBtn())