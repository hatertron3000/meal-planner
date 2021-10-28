// Slug format: YYYY-MM-DD

import { useRouter } from 'next/router'
import RecipeSearch from '../../components/recipeSearch'
import months from '../../lib/months'

export default function AddMeal() {
    const router = useRouter()
    const { dateString } = router.query
    console.log(router.query)

    // const year = dateArray[0]


    return <div>
        { <h1>{`Add Meal for ${months[dateString.split('-')[1] - 1]} ${dateString.split('-')[2]}, ${dateString.split('-')[0]}`}</h1> }
        <RecipeSearch onChooseRecipe={() => window.alert('TODO: Implement')}/>
    </div>
}