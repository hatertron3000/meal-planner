import Image from 'next/image'

export default function ShoppingListGenerator({meals}) {

    //     /*
    //         // item
    //         {
    //             food: "kosher salt",
    //             foodCategory: "Condiments and sauces"
    //             foodId: "food_a1vgrj1bs8rd1majvmd9ubz8ttkg"
    //             image: "https://www.edamam.com/food-img/694/6943ea510918c6025795e8dc6e6eaaeb.jpg"
    //             amounts: [
    //                 {
    //                     quantity: 4,
    //                     measure: "teaspoons"
    //                 },
    //                 {
    //                     quantity: 1,
    //                     measure: "pinch"
    //                 }
    //             ]
    //         }
    //     */


    const allItems = meals
        .flatMap(meal => meal.recipe.ingredients)
        .map(({food, foodId, foodCategory, image, quantity, measure}) => ({
            food,
            foodId,
            foodCategory,
            image,
            amounts: [{
                quantity,
                measure
            }]
        }))
        .reduce((items, item) => {
          if (items
            .map(({foodId}) => foodId) 
            .includes(item.foodId)) {
            // compare the current item's amounts[0].measure to the measures of all amounts in the previous item's amounts
                return items.map(i => {
                    if(i.foodId === item.foodId) {
                        console.log('found a dupe', item)
                        let newAmounts = []
                        if(i.amounts.map(({measure}) => measure).includes(item.amounts[0].measure)) {
                            // combine the amounts
                            newAmounts = i.amounts.map(amount => amount.measure === item.amounts[0].measure
                                ? {
                                    quantity: amount.quantity + item.amounts[0].quantity,
                                    measure: amount.measure
                                }
                                : amount)
                            i.amounts = newAmounts
                        } else {
                            // add the new amount
                            newAmounts = i.amounts.concat([{
                                quantity: item.amounts[0].quantity,
                                measure: item.amounts[0].measure
                            }])
                            i.amounts = newAmounts
                        }
                    }
                    console.log(i)
                    return i
                })
          } else {
            items.push(item)
            return items
          }  
        }, [])


    

    return (
        <div>
            <h2>Shopping List Generator</h2>
            <div>
                <h3>All items</h3>
                <p>Select items to add to the list</p>
                {allItems.map((item, i) => {
                    console.log(`${item.image.slice(0, -4)}-s${item.image.slice(-4)}`)
                    return <div key={i} style={{display: 'flex'}}>
                        <div>
                            <input type="checkbox" value={item.foodId} /> 
                        </div>
                        <div className="thumbnail" >
                            <Image src={`${item.image.slice(0, -4)}-s${item.image.slice(-4)}`} width="100px" height="100px"/>
                        </div>
                        <div>
                            <p>{item.food}</p>
                            <ul>
                            {item.amounts.map((amount, i) => (
                                <li key={i}>{amount.quantity} {amount.measure}</li>
                            ))}
                            </ul>
                        </div>
                    </div>
}               )}
            </div>
            <style jsx>
                {`
                    .thumbnail {
                        border-radius: 33%;
                        overflow: hidden;
                        margin-right: 1em;
                        margin-left: 1em;
                    }
                `}
            </style>
        </div>
    )
}