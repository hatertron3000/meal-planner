import { useState } from "react"
import styles from './RecipeSearch.module.css'
import { diets, healths, cuisineTypes, mealTypes, dishTypes } from "../../lib/edamam"
import Image from 'next/image'
import Link from 'next/link'

const RecipeCard = ({ recipe }) => {
    const { image, url, source, label } = recipe
    return <div className={styles.recipeCard}>
        <Link href={url}>
            <Image src={image} height={300} width={300} alt={`Picture of ${label}`} />
        </Link>
        <p><a href={url} target="_blank">
            {label}
        </a></p>
        <address>Source: {source}</address>
    </div>
}

export default function RecipeSearch( {onChooseRecipe} ) {
    const [diet, setDiet] = useState('any'),
    [health, setHealth] = useState('any'),
    [cuisineType, setCuisineType] = useState('any'),
    [mealType, setMealType] = useState('any'),
    [dishType, setDishType] = useState('any'),
    [keyword, setKeyword] = useState(''),
    [searchResults, setSearchResults] = useState({ recipes: [], links: {} })

    const onSearchRecipes = async () => {
        const url = `/api/recipes?keyword=${keyword}&diet=${diet}&health=${health}&cuisineType=${cuisineType}&mealType=${mealType}&dishType=${dishType}`
        try {
            const res = await fetch(url)
            const data = await res.json()

            const newResults = {
                recipes: data.recipes,
            }

            if (data.links)
                newResults.links = data.links
            
            setSearchResults(newResults)
        } catch(err) {
            console.error(err)
            window.alert('Error searching recipes')
        }
    }

    const onGetNextPage = async (next) => {
        let url = `/api/recipes?`
        let firstParam = true
        for (const key of Object.keys(next)) {
            url += `${firstParam ? '' : '&'}${key}=${next[key]}`
            firstParam = false
        }
        try {
            const res = await fetch(url)
            const data = await res.json()

            const newResults = {
                recipes: data.recipes.concat(searchResults.recipes),
            }

            if (data.links)
                newResults.links = data.links
            
            setSearchResults(newResults)
        } catch(err) {
            console.error(err)
            window.alert('Error searching recipes')
        }
    }
    
    return <div className={styles.container}>
        <div>
            <h2>Recipe Search</h2>
            <div className={styles.searchContainer}>
                <div>
                    <p><label htmlFor="keyword">Search</label></p>
                    <input name="keyword" value={keyword} onChange={e => setKeyword(e.target.value)} />
                </div>
                <div>
                    <button onClick={onSearchRecipes}>Search</button>
                </div>
            </div>
            <div className={styles.filtersContainer}>
                <div>
                    <p>Choose a cuisine</p>
                    {cuisineTypes.map(cuisineTypeOption => <p>
                        <input 
                            type="radio"
                            name="cuisineType"
                            id={`${cuisineTypeOption}-cuisineType`}
                            value={cuisineTypeOption}
                            checked={cuisineTypeOption === cuisineType}
                            onClick={() => setCuisineType(cuisineTypeOption)}
                        />
                        <label onClick={() => setCuisineType(cuisineTypeOption)} htmlFor={cuisineTypeOption}>{cuisineTypeOption}</label>
                    </p>)
                    }
                </div>
                <div>
                    <p>Choose a meal</p>
                    {mealTypes.map(mealTypeOption => <p>
                        <input 
                            type="radio"
                            name="mealType"
                            id={`${mealTypeOption}-mealType`}
                            value={mealTypeOption}
                            checked={mealTypeOption === mealType}
                            onClick={() => setMealType(mealTypeOption)}
                        />
                        <label onClick={() => setMealType(mealTypeOption)} htmlFor={mealTypeOption}>{mealTypeOption}</label>
                    </p>)
                    }
                </div>
                <div>
                    <p>Choose a dish</p>
                    {dishTypes.map(dishTypeOption => <p>
                        <input 
                            type="radio"
                            name="dishType"
                            id={`${dishTypeOption}-dishType`}
                            value={dishTypeOption}
                            checked={dishTypeOption === dishType}
                            onClick={() => setDishType(dishTypeOption)}
                        />
                        <label onClick={() => setDishType(dishTypeOption)} htmlFor={dishTypeOption}>{dishTypeOption}</label>
                    </p>)
                    }
                </div>
                <div>
                    <p>Choose a diet</p>
                    {diets.map(dietOption => <p>
                        <input 
                            type="radio"
                            name="diet"
                            id={`${dietOption}-diet`}
                            value={dietOption}
                            checked={dietOption === diet}
                            onClick={() => setDiet(dietOption)}
                        />
                        <label onClick={() => setDiet(dietOption)} htmlFor={dietOption}>{dietOption}</label>
                    </p>)}
                </div>
                <div>
                    <p>Choose a health filter</p>
                    {healths.map(healthOption => <p>
                        <input
                            type="radio"
                            name="health"
                            id={`${healthOption}-health`}
                            value={healthOption}
                            checked={healthOption === health}
                            onClick={() => setHealth(healthOption)}
                        />
                        <label onClick={() => setHealth(healthOption)} htmlFor={healthOption}>{healthOption}</label>
                    </p>)}
                </div>
            </div>
        </div>
        <div className={styles.resultsContainer}>
            <h2>Results</h2>
            {searchResults.links.next 
                ? <button onClick={() => onGetNextPage(searchResults.links.next)}>Load more results</button>
                : null }
            <div className={styles.cardsContainer}>
                { searchResults.recipes.map(recipe =>  <RecipeCard recipe={recipe} />)}
            </div>
        </div>
    </div>
}