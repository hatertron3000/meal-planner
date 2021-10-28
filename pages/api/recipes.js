import { searchRecipes } from "../../lib/edamam"

export default async function RecipesApi(req, res) {
    try {
        const recipes = await searchRecipes(req.query)
        res.status(200).json(recipes)
    } catch(err) {
        console.error(err)
        res.status(500).json({ error: "error searching recipes"})
    }
    
}