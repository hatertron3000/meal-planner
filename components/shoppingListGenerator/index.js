import ImageWithFallback from '../imageWithFallback'
import { useState } from 'react'
export default function ShoppingListGenerator({meals}) {
    const [selectedItems, setSelectedItems] = useState([])
    const onSelectItem = (item) => {
        setSelectedItems(selectedItems.concat(item))
    }

    const onDeselectItem = (item) => {
        setSelectedItems(selectedItems.filter(i => i.foodId != item.foodId))
    }

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
                    return i
                })
          } else {
            items.push(item)
            return items
          }  
        }, [])


    

    return (
        <div className="container">
            <h2>Shopping List Generator</h2>
            <div>
                <h3>All items</h3>
                <p>Select items to add to the list</p>
                <div className="itemsContainer">
                    {allItems.map((item, i) => {
                        const isSelected = selectedItems.map(selectedItem => selectedItem.foodId).includes(item.foodId)
                        console.log(`${item.food} is selected: `, selectedItems.map(selectedItem => selectedItem.foodId).includes(item.foodId))
                        return <div className="item"
                                key={i}
                                onClick={() => isSelected ? onDeselectItem(item) : onSelectItem(item)}
                               >
                            <div>
                                <input type="checkbox"
                                    className="itemCheckbox"
                                    value={item.foodId} 
                                    checked={isSelected}
                                /> 
                            </div>
                            <div className="thumbnail" >
                                {   item.image
                                ? <ImageWithFallback src={`${item.image.slice(0, -4)}-s${item.image.slice(-4)}`}  fallbackSrc='/images/ingredient.png' width="100px" height="100px"/>
                                : <ImageWithFallback src='/images/ingredient.png' width="100px" height="100px" />
                                }
                            </div>
                            <div>
                                <p className="title">{item.food}</p>
                                <ul className="ingredientsList">
                                {item.amounts.map((amount, i) => (
                                    <li key={i}>{amount.quantity} { amount.measure === "<unit>" ? "" : amount.measure }</li>
                                ))}
                                </ul>
                            </div>
                        </div>         
                        })}
                </div>
            </div>
            <div className="shoppingList">
                <h3>Shopping List:</h3>
                <table>

                            <tr>
                                <th>Food</th><th>Amounts</th>
                            </tr>
                            {selectedItems.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.food}</td>
                                    <td>{item.amounts.map((amount, index) => `${ index != 0 ? ` and` : ``} ${ amount.quantity } ${ amount.measure === "<unit>" ? "" : amount.measure }`)}</td>
                                </tr>
                            ))}

                </table>
                <ul>
                {selectedItems.map((item, i) => (
                    <li key={i}>
                        {item.food}: {item.amounts.map((amount, index) => `${ index != 0 ? ` and` : ``} ${ amount.quantity } ${ amount.measure === "<unit>" ? "" : amount.measure }`)}
                    </li>
                ))}
                </ul>
            </div>
            
            <style jsx>
                {`
                    .item {
                        display: flex;
                        padding-top: 1rem;
                        padding-left: 1rem;
                        border-radius: 17%;
                        border-style: solid;
                        border-color: #5c7aff;
                        background-color: #73FBD3;
                        margin-bottom: 1rem;
                        margin-right: .66rem;
                    }

                    .itemCheckbox {
                        width: 1.5rem;
                        height: 1.5rem;
                    }

                    .itemCheckbox:checked {
                        box-shadow: 0 0 .4em #5c7aff;
                    }

                    .shoppingList > table td {
                        border-style: solid;
                        border-width: 1px 0px;
                        margin: 0;
                        padding: .2rem .7rem;
                    }
                    
                    .ingredientsList {
                        word-break: break-word;
                    }

                    .title {
                        width: 9rem;
                        word-break: break-all;
                    }

                    .container {
                        margin-left: 3em;
                        margin-right: 3em;
                    }
                        
                    .thumbnail {
                        border-radius: 17%;
                        overflow: hidden;
                        margin-right: 1em;
                        margin-left: 1em;
                    }

                    .itemsContainer {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-around;
                    }
                `}
            </style>
        </div>
    )
}