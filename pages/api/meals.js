import clientPromise, { collections, ObjectID } from "../../lib/mongodb"

/* 
    MongoDB does not support key names with dots.
    Edamam recipes include a key named SUGAR.added
    Therefore, the meal planner needs to encode/decode recipes
*/
const encodeRecipe = (recipe) => {
    if  (recipe.totalNutrients && recipe.totalNutrients["SUGAR.added"]) {
        recipe.totalNutrients.SUGARadded = recipe.totalNutrients["SUGAR.added"]
        delete recipe.totalNutrients["SUGAR.added"]
    }
    return recipe
}

const decodeRecipe = (recipe) => {
    if  (recipe.totalNutrients && recipe.totalNutrients.SUGARadded) {
        recipetotalNutrients["SUGAR.added"] = recipe.totalNutrients.SUGARadded
        delete recipe.totalNutrients.SUGARadded
    }
    return recipe
}

export default async function MealsApi(req, res) {
    const client = await clientPromise
    const isConnected = await client.isConnected()
    const db = await client.db()
    const collection = db.collection(collections.mealPlans)

    if (req.method === "GET") {
        const { min_date, max_date } = req.query
        if (!min_date) {
            res.status(400).json({ error: 'min_date is a required query parameter'})
        } else if (!max_date) {
            res.status(400).json({ error: 'min_date is a required query parameter'})
        } else  if(Date.parse(min_date) == NaN){
                    res.status(400).json({ error: 'min_date is invalid'})
        } else if (Date.parse(max_date) == NaN) {
            res.status(400).json({ error: 'min_date is invalid'})
        } else {
            try {
                const findCursor = await collection.find({
                    date: {
                        $gte: new Date(min_date),
                        $lt: new Date(max_date)
                    }
                })

                const meals = await findCursor.toArray()

                res.status(200).json(meals)
            } catch(err) {
                console.error(err)
                res.status(500).json({ error: "application error"})
            }
        }
    }
    
    if (req.method === "DELETE") {
        const { id } = req.query
        if(!id)
            res.status(400).json({ error: 'id is a required query parameter'})
        else {
            try {
                const deleteResult = await collection.deleteOne({
                    _id: new ObjectID(id)
                })

                if (deleteResult.deletedCount) {
                    res.status(204).send()
                } else {
                    throw new Error('No document deleted')
                }
            } catch(err) {
                console.error(err)
                res.status(500).json({ error: 'application error'})
            }
        }
    }

    if (req.method === "POST") {
        if (typeof req.body != "object")
            res.status(415).json({ error: 'Unsupported content-type. Use application/json' })
        else if (!req.body)
            res.status(400).json({ error: "Bad request"})
        else if (!req.body.recipe)
            res.status(400).json({ error: 'recipe is required'})
        else if (!req.body.recipe.url)
            res.status(400).json({ error: "recipe.url is a required field"})
        else if (!req.body.recipe.label)
            res.status(400).json({ error: "recipe.label is a required field"})
        else if (!req.body.date) {
            res.status(400).json({ error: "date is required"})
        }
        else if (!isConnected)
            res.status(500).json({ error: "application error" })
        else {
            try {
            /* TODO: Create Meal and Recipe schemas */
            const recipe = encodeRecipe(req.body.recipe)
            const meal = {
                date: new Date(req.body.date),
                createdAt: new Date(),
                recipe
            }

            /* TODO: Validate input more thoroughly */
            const commandResult = await collection.insertOne(meal)
            if (commandResult.result.ok)
                res.status(201).json({meal})
            else {
                res.status(500).json({ error: "application error"})
            }
        } catch(err) {
            console.error(err)
            res.status(500).json({ error: "application error"})
        }
    }
    }
}