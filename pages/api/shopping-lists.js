import clientPromise, { ObjectID } from "../../lib/mongodb"
import collections from "../../lib/collections"


export default async function MealsApi(req, res) {
    const client = await clientPromise
    const isConnected = await client.isConnected()
    const db = await client.db()
    const collection = db.collection(collections.shoppingLists)

    if (!isConnected) {
        res.status(500).json({ error: 'DB connection error'})
        return
    }

    if (req.method === "PUT") {
        if (typeof req.body != "object")
            res.status(415).json({ error: 'Unsupported content-type. Use application/json' })
        else if (!req.body)
            res.status(400).json({ error: "Bad request"})
        else if (!req.body.meals)
            res.status(400).json({ error: 'meals is a required field'})
        else if (!req.body.meals.length)
            res.status(400).json({ error: 'meals may not be empty'})
        else if (!req.body.items)
            res.status(400).json({ error: 'items is a required field'})
        else if (!req.body.items.length)
            res.status(400).json({ error: 'items may not be empty'})
        else if (!req.body.name)
            res.status(400).json({ error: 'name is a required field'})
        else if (req.body.name.length < 1 || req.body.name.length > 256) 
            res.status(400).json({ error: 'name must be between 1 and 256 characters'})   
        else {
            try {
                const { _id, meals, items, name, ...rest} = req.body
                console.log(_id)
                if(!ObjectID.isValid(_id)) 
                    throw new Error('Invalid list id')

                const updateResult = await collection.updateOne({
                    _id: new ObjectID(_id)
                }, { $set: 
                    {
                        meals,
                        items,
                        name,
                        ...rest
                    }
                })

                if(updateResult.matchedCount) {
                    res.status(200).json({
                        _id,
                        meals,
                        items,
                        name,
                        ...rest
                    })
                }
            } catch(err) {
                console.error(err)
                res.status(500).json({ error: "application error"})
            }
        }
    }

    if (req.method === "GET") {
        try {
            const { id } = req.query
            if(id) {
                if( ObjectID.isValid(id) ) {
                    const list = await collection.findOne({
                        _id: new ObjectID(id)
                    })
                    if (list)
                        res.status(200).json(list)
                } else {
                    res.status(204)
                }
            } else {
                const findCursor = await collection.find({})
                const shoppingLists = await findCursor.toArray()
                res.status(200).json(shoppingLists)
            }
        } catch(err) {
            console.error(err)
            res.status(500).json({ error: "application error"})
        }
    }

    if (req.method === "POST") {
        if (typeof req.body != "object")
        res.status(415).json({ error: 'Unsupported content-type. Use application/json' })
        else if (!req.body)
            res.status(400).json({ error: "Bad request"})
        else if (!req.body.meals)
            res.status(400).json({ error: 'meals is a required field'})
        else if (!req.body.meals.length)
            res.status(400).json({ error: 'meals may not be empty'})
        else if (!req.body.items)
            res.status(400).json({ error: 'items is a required field'})
        else if (!req.body.items.length)
            res.status(400).json({ error: 'items may not be empty'})
        else if (!req.body.name)
            res.status(400).json({ error: 'name is a required field'})
        else if (req.body.name.length < 1 || req.body.name.length > 256) 
            res.status(400).json({ error: 'name must be between 1 and 256 characters'})   
        else {
            try {
                const { name, meals, items } = req.body
                /* TODO: Create Meal and Item schemas */
                /* TODO: Validate input more thoroughly */
                const shoppingList = {
                    name,
                    meals,
                    items
                }
                const commandResult = await collection.insertOne(shoppingList)
                if (commandResult.result.ok)
                    res.status(201).json({shoppingList})
                else {
                    res.status(500).json({ error: "application error"})
                }
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
}