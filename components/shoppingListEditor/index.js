import ImageWithFallback from '../imageWithFallback'
import ItemCard from './itemCard'
import { useState } from 'react'

export default function ShoppingListEditor({meals, onSave, list}) {
    const [selectedItems, setSelectedItems] = useState(list?list.items:[])
    const [name, setName] = useState(list?list.name:`Shopping list created ${new Date().toDateString()}`)
    console.log(list)
    const handleSave = async () => {
        const url = '/api/shopping-lists'
        const options = {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name,
                meals,
                items: selectedItems
            })
        }

        try {
            const res = await fetch(url, options)
            const data = await res.json()
            if(!data.shoppingList)
                throw new Error('Shopping list not created')
            else {
                console.log(data.shoppingList)
                window.alert('Shopping list created successfully')
                onSave()
            }
        } catch(err) {
            console.error(err)
            window.alert(err)
        }
    }

    
    const handleUpdate = async () => {
        const url = '/api/shopping-lists'
        const options = {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                _id: list._id,
                name,
                meals,
                items: selectedItems
            }),
        }

        try {
            const res = await fetch(url, options)
            const updatedList = await res.json()
            if(updatedList) {
                window.alert('Successfully updated the list')
            } else
                throw new Error('No list in the response from shopping-lists api')
        } catch(err) {
            console.error(err)
            window.alert('Failed to update the list')
        }
    }

    // const handleUpdate = async () => {
    //     // TODO
    //     onSaveOrUpdate({
    //         name,
    //         meals,
    //         items: selectedItems
    //     })
    // }

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
            <h2>Shopping List Editor</h2>
            <div>
                <h3>List name</h3>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="nameInput" />
            </div>
            <div>
                <h3>Unselected items</h3>
                <p>Select items to add to the list</p>
                <div className="itemsContainer">
                    {allItems.map((item, i) => {
                        const isSelected = selectedItems.map(selectedItem => selectedItem.foodId).includes(item.foodId)
                        if(!isSelected)
                            return <ItemCard isSelected={isSelected} onDeselectItem={onDeselectItem} onSelectItem={onSelectItem} item={item}/>
                    })}
                </div>
                <h3>Selected items</h3>
                <p>Select items to add to the list</p>
                <div className="itemsContainer">
                    {allItems.map((item, i) => {
                        const isSelected = selectedItems.map(selectedItem => selectedItem.foodId).includes(item.foodId)
                        if(isSelected)
                            return <ItemCard isSelected={isSelected} onDeselectItem={onDeselectItem} onSelectItem={onSelectItem} item={item}/>
                    })}
                </div>
            </div>
            <div style={{display: 'flex'}}>
                <div className="mealList">
                        <h3>Meals List</h3>
                        <ul>
                        {meals.length > 0
                        && meals.map((meal, i) => (
                            <li key={i}><a href={meal.recipe.url} target="_blank">{meal.recipe.label}</a>
                            </li>
                        ))}
                        </ul>
                </div>
                <div className="shoppingList">
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div>
                            <h3>Shopping List:</h3>
                        </div>
                        <div className="actionsContainer">
                            {!list
                            && selectedItems.length > 0
                            && <button onClick={handleSave}>
                                Save Shopping List
                            </button>}

                            {list
                            && selectedItems.length > 0
                            && <button onClick={handleUpdate}>
                                Update Shopping List
                            </button>}
                        </div>
                    </div>
                    { selectedItems.length > 0
                    && <table>
                        <tr>
                            <th>Food</th><th>Amounts</th>
                        </tr>
                        {selectedItems.map((item, i) => (
                            <tr key={i}>
                                <td>{item.food}</td>
                                <td>{item.amounts.map((amount, index) => `${ index != 0 ? ` and` : ``} ${ Math.round(amount.quantity * 100) / 100 } ${ amount.measure === "<unit>" ? "" : amount.measure }`)}</td>
                            </tr>
                        ))}
                    </table>}
                </div>
            </div>
            
            <style jsx>
                {`
                    .nameInput {
                        border-style: inset;
                        border-width: .2em;
                        border-radius: .4em;
                        border-color: #5C7AFF;
                        background-color: #73fbd3;
                        padding: .25em;
                        font-size: 1.23em;
                    }

                    .nameInput:focus {
                        box-shadow: 0 0 .8em #59d2fe;
                    }

                    .actionsContainer {
                        margin-left: 1rem;
                    }

                    .actionsContainer button {
                        background-color: #5c7aff;
                        padding: .5rem 1.5rem;
                        font-size: 1rem;
                        border-radius: .6rem;
                        font-weight: bold;
                        color: white;
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

                    .mealList {
                        padding:  .2rem .7rem;
                        margin-right: 3rem;
                    }

                    .mealList a {
                        color: #4A8FE7;
                        cursor: pointer;
                    }

                    .mealList a:before {
                        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVR42qXKwQkAIAxDUUdxtO6/RBQkQZvSi8I/pL4BoGw/XPkh4XigPmsUgh0626AjRsgxHTkUThsG2T/sIlzdTsp52kSS1wAAAABJRU5ErkJggg==);
                        margin: 0 3px 0 5px;
                    }

                    .mealList a:hover {
                        color: #59D2FE;
                    }

                    .container {
                        margin-left: 3em;
                        margin-right: 3em;
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