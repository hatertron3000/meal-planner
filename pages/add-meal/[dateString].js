// Slug format: YYYY-MM-DD

import { useRouter } from 'next/router'
import RecipeSearch from '../../components/recipeSearch'
import months from '../../lib/months'

export default function AddMeal() {
    const { isReady, query } = useRouter()
    const { dateString } = query


    return isReady
        ? <div>
            { <h1>{`Add Meal for ${months[dateString.split('-')[1] - 1]} ${dateString.split('-')[2]}, ${dateString.split('-')[0]}`}</h1> }
            <RecipeSearch onChooseRecipe={() => window.alert('TODO: Implement')}/>
        </div>
        : <div>Loading...</div>
    }