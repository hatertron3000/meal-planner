const baseUrl = "https://api.edamam.com"
const app_key = process.env.EDAMAM_APP_KEY
const app_id = process.env.EDAMAM_APP_ID

// Filters from Edamam API spec linked from https://developer.edamam.com/edamam-docs-recipe-api 
export const diets = ['any', 'balanced', 'high-fiber', 'high-protein', 'low-carb', 'low-fat', 'low-sodium',],
    healths = ['any', 'alcohol-free', 'celery-free', 'crustacean-free', 'dairy-free', 'DASH', 'egg-free', 'fish-free', 'fodmap-free', 'gluten-free', 'immuno-supportive', 'keto-friendly', 'kidney-friendly', 'kosher', 'low-fat-abs', 'low-potassium', 'low-sugar', 'lupine-free', 'Mediterranean', 'mustard-free', 'no-oil-added', 'paleo', 'peanut-free', 'pescatarian', 'pork-free', 'red-meat-free', 'sesame-free', 'shellfish-free', 'soy-free', 'sugar-conscious', 'tree-nut-free', 'vegan', 'vegetarian', 'wheat-free'],
    cuisineTypes = ['any', 'American', 'Asian', 'British', 'Caribbean', 'Central Europe', 'Chinese', 'Eastern Europe', 'French', 'Indian', 'Italian', 'Japanese', 'Kosher', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'South American', 'South East Asian'],
    mealTypes = ['any', 'Breakfast','Dinner','Lunch','Snack','Teatime',],
    dishTypes = ['any', 'Biscuits and cookies','Bread','Cereals','Condiments and sauces','Desserts','Drinks','Main course','Pancake','Preps','Preserve','Salad','Sandwiches','Side dish','Soup','Starter','Sweets']

function parseRecipeSearchResults(data) {
    const recipes = data.hits.map(({ recipe }) => recipe)
    const links = {}
    if (data._links && data._links.next) {
        links.next = {}
        const nextUrl = new URL(data._links.next.href)
        for (const param of nextUrl.searchParams.entries()) {
            if(param[0] != 'type'
            && param[0] != 'app_key'
            && param[0] != 'app_id')
                links.next[param[0]] = param[1]
        }
    }

    return {
        recipes,
        links
    }
}

export async function searchRecipes({
    diet,
    health,
    cuisineType,
    mealType,
    dishType,
    keyword,
    q,
    _cont
}) {
    const url = `${baseUrl}/api/recipes/v2?type=public&app_key=${app_key}&app_id=${app_id}${
        keyword && keyword != 'any'
            ? `&q=${encodeURIComponent(keyword)}`
            : q 
                ? `&q=${encodeURIComponent(q)}`
                : ''}${
        diet && diet != 'any'
            ? `&diet=${diet}`
            : ''}${
        health && health != 'any'
            ? `&health=${health}`
            : ''}${
        cuisineType && cuisineType != 'any'
            ? `&cuisineType=${cuisineType}`
            : '' }${
        mealType && mealType != 'any'
            ? `&mealType=${mealType}`
            : '' }${
        dishType && dishType != 'any'
            ? `&dishType=${dishType}`
            : ''
        }${
        _cont
            ? `&_cont=${_cont}`
            : ''
        }`

    try {
        const res =  await fetch(url)
        const data = await res.json()

        if(data.hits) {
            return parseRecipeSearchResults(data)
        } else if (data.status && data.status.error) {
            throw new Error(data.message)
        }
    } catch (err) {
        console.error(err)
        return new Error('Error calling the Edamam API')
    }
}
