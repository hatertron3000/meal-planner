// dateString format: YYYY-MM-DD

import { useState } from 'react'
import { useRouter } from 'next/router'
import RecipeSearch from '../../components/recipeSearch'
import clientPromise from '../../lib/mongodb'
import collections from '../../lib/collections'
import Link from 'next/link'

export default function AddMeal({ isConnected, initialMeals }) {
    const [ meals, setMeals ] = useState(JSON.parse(initialMeals))
    const [ errors, setErrors ] = useState([])
    const { isReady, query } = useRouter()
    const { dateString } = query
    const mealsApiPath = '/api/meals'

    const onAddToPlan = async (recipe) => {
        const date = new Date(dateString)
        if (date.getFullYear() > 1970) {
            const meal = {
                date: new Date(dateString),
                recipe
            }
    
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
                }
            } catch(err) {
                console.error(err)
                setErrors(errors.concat(err))
            }
        } else {
            setErrors(errors.concat('Invalid date'))
        }
        

    }

    const onDeleteMeal = async (id) => {
        const options = {
            method: 'DELETE'
        }

        const res = await fetch( `${mealsApiPath}?id=${id}`, options)
        if (res.status == 204) {
            setMeals(meals.filter(meal => meal._id != id))
        } else {
            setErrors(errors.concat(`Unable to remove ${id} from meal plan`))
        }
    }

    return isReady
        ? isConnected 
            ? <div>
                <Link href={{pathname: '/', query: { date: dateString }}}><button>&lt;&lt; Back to Meal Planner</button></Link>
                { <h1>{`Meal Plan for ${new Date(dateString).toDateString()}`}</h1> }
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
      