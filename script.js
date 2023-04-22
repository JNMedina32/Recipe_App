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
const paramArray = [];
const formEl = document.forms.recipeFilters;
console.log(formEl);
const formData = new FormData(formEl);
console.log(formData);
const name = formData.get('value');

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
async function submitBtn(){
    let dishTypeSelected = dropdownSelection(dishType);
    if(dishTypeSelected != 'None'){
        paramArray.push(dishTypeSelected)
    } 
    const param = `&dishType=${paramArray[0]}`;
    const fetchURL = `${urlToFetch}${param}`;
    try{
        const response = await fetch(fetchURL);
        if(response.ok){
            const jsonResponse = await response.json();
            const hits = jsonResponse.hits;
            const imgSrc = hits[0].recipe.images.THUMBNAIL.url;
            firstImgTag.setAttribute('src', imgSrc);
        }
    }catch(error){
        console.log(error);
    }
};
// console.log(submitBtn())