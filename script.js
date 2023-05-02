//Variables for the fetch
const baseURL = `https://api.edamam.com/api/recipes/v2?type=public&`;
const proxyServer = `https://safe-recipe-app-jnm.deno.dev`

//variables for dynamic html
const resultContainer = document.querySelector('#resultContainer');
const submitButton = document.querySelector('#submitBtn');
const filterContainer = document.querySelector('#filterContainer');
const savedRecipeArray = [];
const savedContainer = document.querySelector('#savedRecipes');
const refilterDiv = document.querySelector('#refilterDiv');
const refilterBtn = document.querySelector('#refilterButton');
let indvidualRecipe = document.createElement('div')
indvidualRecipe.className = 'individualRecipe';
//grabs the filter forms key and values pairs
const formEl = document.querySelector('#recipeFilters');

//each recipe result assumes this class
class Recipe {

	constructor(recipe){
		this._label = recipe.recipe.label.replace(/'/g, '');
		this._calories = recipe.recipe.calories.toFixed(2);
		this._imgSmall = recipe.recipe.images.SMALL.url;
		this._imgThumb = recipe.recipe.images.THUMBNAIL.url;
		this._ingredients = '<ul>';
		recipe.recipe.ingredientLines.forEach(ingredient => this._ingredients += `<li>` + ingredient + `</li>`);
		this._ingredients += `</ul>`;
		this._prep = recipe.recipe.url;
		this._time = recipe.recipe.totalTime;
		this._cuisineType = recipe.recipe.cuisineType[0];
	}
	get label(){return this._label}
	get calories(){return this._calories}
	get imgSmall(){return this._imgSmall}
	get imgThumb(){return this._imgThumb}
	get ingredients(){return this._ingredients}
	get prep(){return this._prep}
	get time(){return this._time}
	get cuisineType(){return this._cuisineType}

	
	displayRecipe(){
		let indvidualRecipe = document.createElement('div');
		indvidualRecipe.className = 'individualRecipe';
		indvidualRecipe.innerHTML += `
		<h1 class="label">${this.label}</h1><br>
		<img src=${this.imgSmall}><br>
		<p class='calories'><strong>Calories: ${this.calories}	<br> Time: ${this.time} mins</strong></p><br>
		<div class='ingredients'>
		<p>Ingredients: ${this.ingredients}</p>
		<br>
		</div>
		<div class='prepAndSave'>
		<a href="${this.prep}" target='_blank' class='buttons'>How to Prepare</a> 
		<div class='buttons save-recipe' onclick='saveRecipeToLocalStorage("${this.label}", "${this.imgThumb}", "${this.calories}", "${this.prep}")'>Save Recipe</div>
		</div>
		`;
		resultContainer.append(indvidualRecipe);
		changeBgImgforIndividualRecipe(this.cuisineType);
	}
}

//changes the background for specific cuisineType
function changeBgImgforIndividualRecipe(typeOfCuisine){
	switch (typeOfCuisine) {
		case "american":
			resultContainer.style.backgroundImage = "url(resources/americanFood.jpg)"
			break;
		case "asian":
			resultContainer.style.backgroundImage = "url(resources/asianFood.jpg)"
			break;
		case "british":
			resultContainer.style.backgroundImage = "url(resources/britishFood.jpg)"
			break;
		case "caribbean":
			resultContainer.style.backgroundImage = "url(resources/caribbeanFood.jpg)"
			break;
		case "central europe":
			resultContainer.style.backgroundImage = "url(resources/centralFood.jpg)"
			break;
		case "chinese":
			resultContainer.style.backgroundImage = "url(resources/chineseFood.jpg)"
			break;
		case "eastern europe":
			resultContainer.style.backgroundImage = "url(resources/easternFood.jpg)"
			break;
		case "french":
			resultContainer.style.backgroundImage = "url(resources/frenchFood.jpg)"
			break;
		case "indian":
			resultContainer.style.backgroundImage = "url(resources/indianFood.jpg)"
			break;
		case "italian":
			resultContainer.style.backgroundImage = "url(resources/italianFood.jpg)"
			break;
		case "japanese":
			resultContainer.style.backgroundImage = "url(resources/japaneseFood.jpg)"
			break;
		case "kosher":
			resultContainer.style.backgroundImage = "url(resources/kosherFood.jpg)"
			break;
		case "mediterranean":
			resultContainer.style.backgroundImage = "url(resources/mediterraneanFood.jpg)"
			break;
		case "mexican":
			resultContainer.style.backgroundImage = "url(resources/mexicanFood.jpg)"
			break;
		case "middle eastern":
			resultContainer.style.backgroundImage = "url(resources/middleFood.jpg)"
			break;
		case "nordic":
			resultContainer.style.backgroundImage = "url(resources/nordicFood.jpg)"
			break;
		case "south american":
			resultContainer.style.backgroundImage = "url(resources/southFood.jpg)"
			break;
		case "south east asian":
			resultContainer.style.backgroundImage = "url(resources/southEastFood.jpg)"
			break;
		default:	
	}
};

//hides the filter form and displays results
function hideFilter(){
	filterContainer.style.display = 'none';
	refilterDiv.style.display = 'inline-block';
};

/**
 * used on the submit button for the results from the fetch
 * @param {*} hits the result from the fetch
 */
function displayRecipes(hits){ 
	resultContainer.innerHTML = ``;
	hits.forEach(recipe => {
		recipe = new Recipe(recipe);
		recipe.displayRecipe();
	})
};
function displayMoreRecipes(hits){ 
	hits.forEach(recipe => {
		recipe = new Recipe(recipe);
		recipe.displayRecipe();
	})
};
//shows the filter form and hides the refilterBtn
refilterBtn.addEventListener('click', () => {
	filterContainer.style.display = null;
})

//unique id for the loadMore button 
let loadMoreId = 1;

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
		const userInputQueryString = `&q=${encodeURIComponent(userInput)}`;
		const nextURL = [];
		try{
			const response = await fetch(`${proxyServer}?${userInputQueryString}&${queryStrings}`);
			
			if(response.ok){
				let jsonResponse = await response.json();
				console.log(jsonResponse);
				const hits = jsonResponse.hits;
				nextURL.push(jsonResponse._links.next.href);
				console.log(nextURL);
				if(hits.length < 1){
					hideFilter();
					resultContainer.innerHTML = `I apologize. Looks like there are no recipes that match your filters in this database <strong>:(</strong>`
				}else {
					displayRecipes(hits);
					hideFilter();
					resultContainer.style.display = 'inline-block';
					resultContainer.innerHTML += `
					<div class="buttons" id="loadMore${loadMoreId}" onclick='nextRecipes("${nextURL[0]}")'>Load More</div>
					`;
				}
			}
		}catch(error){
			console.log(error);
			hideFilter();
			resultContainer.innerHTML = error + `<br>I apologize. Looks like there are no recipes that match your filters in this database <strong>:(</strong> If you are searching for a specific dish, please check your spelling and try again.`
		}
	};
	submitBtn();
});

function nextRecipes(nextUrlToFetch) {
	document.querySelector('#loadMore' + loadMoreId).style.display = 'none';
	loadMoreId += 1;
	async function fetchNext(){
		const nextURL = [];
		try{
			const response = await fetch(nextUrlToFetch);
			if(response.ok){
				let jsonResponse = await response.json();
				console.log(jsonResponse);
				const hits = jsonResponse.hits;
				nextURL.push(jsonResponse._links.next.href);
				if(hits.length < 1){
					resultContainer.innerHTML += `<br>I apologize. We might have ran out of recipes for you. <strong>:(</strong>`
				}else {
					displayMoreRecipes(hits);
					resultContainer.innerHTML += `
					<div class="buttons" id="loadMore${loadMoreId}" onclick="nextRecipes('${nextURL[0]}')">Load More</div>
					`;
				}
			}
		}catch(error){
			console.log(error);
			hideFilter();
			resultContainer.innerHTML += error + `<br>I apologize. We might have ran out of recipes for you.`
		}
	};
	fetchNext();
}

//displays localStorage on load using retrieveLocalStorage function
window.addEventListener('load', () => {
	retrieveLocalStorage();
});
//grabs the recipe info when called and saves to the localStorage and savedContainer 
function saveRecipeToLocalStorage(recipeLabel, recipeThumb, recipeCalories, recipeUrl, id = "recipeID_" + Date.now()){
	savedRecipeArray.push({
		label: recipeLabel, 
		imgThumb: recipeThumb,
		calories: recipeCalories,
		url: recipeUrl,
		id: id
	});
	localStorage.setItem('savedRecipeArray', JSON.stringify(savedRecipeArray));
	const savedRecipeDiv = document.createElement('div');
			savedRecipeDiv.className = 'col';
			savedRecipeDiv.setAttribute('id', 'savedRecipeDiv')
			savedRecipeDiv.innerHTML = `<h4>${recipeLabel}</h4><img src=${recipeThumb}><br><h4>Calories: ${recipeCalories}</h4><a href='${recipeUrl}' target="_blank" class='buttons2'>View</a><div class="buttons2" id="${id}">Delete</div>`;
			savedContainer.append(savedRecipeDiv);
			const deleteSavedRecipeBtn = savedRecipeDiv.querySelector(`#${id}`);
			deleteSavedRecipeBtn.addEventListener('click', () => {
				savedRecipeDiv.remove();
				const indexToRemove = savedRecipeArray.findIndex(recipe => recipe.label === recipeLabel);
				savedRecipeArray.splice(indexToRemove, 1);
				localStorage.setItem('savedRecipeArray', JSON.stringify(savedRecipeArray));
			});
}
//displays all recipes in localStorage
function retrieveLocalStorage(){
	const savedRecipes = JSON.parse(localStorage.getItem('savedRecipeArray'));
	if(savedRecipes){
		savedRecipes.forEach((savedRecipe, index) => {
			savedRecipeArray.push(savedRecipe);
			const savedRecipeDiv = document.createElement('div');
			savedRecipeDiv.className = 'savedRecipe';
			savedRecipeDiv.innerHTML = `<h4>${savedRecipe.label}</h4><img src=${savedRecipe.imgThumb}><br><h4>Calories: ${savedRecipe.calories}</h4><a href='${savedRecipe.url}' target="_blank" class='buttons2'>View</a><div class="buttons2" id="deleteBtn${index}">Delete</div>`;
			savedContainer.append(savedRecipeDiv);
			const deleteSavedRecipeBtn = savedRecipeDiv.querySelector(`#deleteBtn${index}`);
			deleteSavedRecipeBtn.addEventListener('click', () => {
				savedRecipeDiv.remove();
				const indexToRemove = savedRecipeArray.findIndex(recipe => recipe.label === savedRecipe.label);
				savedRecipeArray.splice(indexToRemove, 1);
				localStorage.setItem('savedRecipeArray', JSON.stringify(savedRecipeArray));
			});
		});
	}
};
