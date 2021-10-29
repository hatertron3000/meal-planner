import { searchRecipes } from "../../lib/edamam"

export default async function RecipesApi(req, res) {
    try {
        if(req.method === "GET") {
            const recipes = await searchRecipes(req.query)
            res.status(200).json(recipes)
        } else {
            res.status(405).json({ error: "unsupported method"})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ error: "error searching recipes"})
    }
    
}