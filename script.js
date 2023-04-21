console.log('Running Recipe App')

const baseURL = `https://api.edamam.com/api/recipes/v2?type=any`;
const appID = ``;
const appKey = ``;

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
console.log(mealChecked());

//grabing the dropdown selection for Dish Type
const dishType = document.getElementsByClassName('dishType');
console.log(dishType);

const getRecipeByDish = async (name) => {
    const specificDish = `q=${name}`;
    const urlToFetch = `${baseURL}&${specificDish}&${appID}&${appKey}`;
    try{
        const repsonse = await fetch(urlToFetch);
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
