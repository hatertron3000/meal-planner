import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";

const fetcher = async url => fetch(url).then(res => res.json())

const ShoppingListsComponent = ({ lists, onRemoveList, onEditList }) => {
    console.log('lists', lists)
    return <div>
        <h2>Shopping Lists</h2>
        <table>
            { lists.map((list, i) => <tr key={i} className={'shoppingList'}>
                <td>{list.name} &#40;{list.items.length} items&#41;</td>
                <td>
                    <div className="icon">
                        <Image src="/images/edit.png" width="24px" height="24px" onClick={() => onEditList(list)}/>
                    </div>
                </td>
                <td>
                    <div className="icon">
                        <Image className="icon" src="/images/remove.png" width="24px" height="24px" onClick={() => onRemoveList(list)}/>
                    </div>
                </td>
                </tr> )}
        </table>
        <style jsx>{`
              .shoppingList {
                display: flex;
                padding-top: 1rem;
                padding-left: 1rem;
                padding-bottom: .5rem;
                border-radius: 2rem;
                border-style: solid;
                border-color: #5c7aff;
                background-color: #73FBD3;
                margin-bottom: 1rem;
                margin-right: .66rem;
                font-weight: bold;
            }
            
            .shoppingList:hover {
                box-shadow: 0 0 .8em #59d2fe;
            }

            .icon:hover {
                cursor: pointer;
            }

            .shoppingList td {
                padding: 0 2em;
            }
            `}
        </style>
    </div>
}

export default function ShoppingLists({ onEditList }) {
    let {data, error, mutate} = useSWR(`/api/shopping-lists`, fetcher)

    const onRemoveList = async (list) => {
        if (window.confirm(`Are you sure that you want to delete the list named "${list.name}"?`)) {
            const url = `/api/shopping-lists?id=${list._id}`
            const options = {
                method: 'DELETE'
            }

            try {
                const res = await fetch(url, options)
                if (res.status != 204)
                    throw new Error('Failed to delete the shopping list')
                window.alert('Successfully deleted')
                mutate()
            }
            catch(err) {
                console.error(err)
                window.alert('Failed to delete the list.')
            }
        }
    }
    



    if (error)
        return <div>Error retrieving shopping lists. Please try again</div>
    else
        return <ShoppingListsComponent lists={data?data:[]} onRemoveList={onRemoveList} onEditList={onEditList} />
}