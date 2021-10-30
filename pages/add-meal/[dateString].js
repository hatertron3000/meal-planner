// dateString format: YYYY-MM-DD

import { useState } from 'react'
import { useRouter } from 'next/router'
import RecipeSearch from '../../components/recipeSearch'
import months from '../../lib/months'
import clientPromise, { collections } from '../../lib/mongodb'
import Link from 'next/link'

export default function AddMeal({ isConnected, initialMeals }) {
    const [ meals, setMeals ] = useState(JSON.parse(initialMeals))
    const [ errors, setErrors ] = useState([])
    const { isReady, query } = useRouter()
    const { dateString } = query
    const mealsApiPath = '/api/meals'

    const onAddToPlan = async (recipe) => {
        const meal = {
            date: dateString,
            recipe
        }
        console.log(meal)
        const options = {
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(meal)
        }

        try {
            const res = await fetch(mealsApiPath, options)
            const data = await res.json()
            if(!data.meal)
                throw new Error('Meal not created')
            else {
                setMeals(meals.concat(data.meal))
                console.log(data.meal)
            }
        } catch(err) {
            console.error(err)
            setErrors(errors.concat(err))
        }
    }

    const onDeleteMeal = async (id) => {
        const options = {
            method: 'DELETE'
        }

        const res = await fetch( `${mealsApiPath}?id=${id}`, options)
        if (res.status == 204) {
            console.log('deleted successfully')
            setMeals(meals.filter(meal => meal._id != id))
        } else {
            setErrors(errors.concat(`Unable to remove ${id} from meal plan`))
        }
    }

    return isReady
        ? isConnected 
            ? <div>
                <Link href="/"><button>&lt;&lt; Back to Meal Planner</button></Link>
                { <h1>{`Meal Plan for ${months[dateString.split('-')[1] - 1]} ${dateString.split('-')[2]}, ${dateString.split('-')[0]}`}</h1> }
                <div>
                    {errors.map(error => <p>{error.message}</p>)}
                </div>
                <div>
                    {meals.map(meal => (<div>
                        <p>
                            <a href={meal.recipe.url} target="_blank">{meal.recipe.label}</a>
                            <button onClick={() => onDeleteMeal(meal._id)}>
                                Remove from Meal Plan
                            </button>
                        </p>
                    </div>))}
                </div>
                <RecipeSearch addToPlan={onAddToPlan} />
            </div>
            :<div>Error loading this page, try again.</div>
        : <div>Loading...</div>
    }

    export async function getServerSideProps(context) {
        const { dateString } = context.params
        const client = await clientPromise
        const isConnected = await client.isConnected()
        const db = await client.db()
        const collection = await db.collection(collections.mealPlans)
        
        const query = {
            date: new Date(dateString)
        }

        const queryOptions = {
            sort: { createdAt: 1 }
        } 

        const cursor = await collection.find(query, queryOptions)

        const meals = await cursor.toArray()
        const initialMeals = JSON.stringify(meals)
        
        return {
          props: { isConnected, initialMeals },
        }
      }
      