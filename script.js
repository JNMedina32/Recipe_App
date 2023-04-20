console.log('Running Recipe App')

const baseURL = `https://api.edamam.com/api/recipes/v2?type=any`;
const appID = ``;
const appKey = ``;

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