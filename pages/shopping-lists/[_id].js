import useSWR from 'swr'
import { useRouter } from 'next/router'
import ShoppingListEditor from '../../components/shoppingListEditor'
import Link from 'next/link'

const fetcher = url => fetch(url).then(res => res.json())

export default function ShoppingListPage() {
    const { query } = useRouter()
    const { _id } = query
    console.log(query)
    const {data, error, mutate } = useSWR(`/api/shopping-lists?id=${_id}`, fetcher)

    const onUpdateList = async (list) => {
        const url = '/api/shopping-lists'
        const newList = list
        newList._id = _id
        const options = {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(newList),
        }

        try {
            const res = await fetch(url, options)
            const list = await res.json()
            if(list) {
                window.alert('Successfully updated the list')
                mutate()
            } else
                throw new Error('No list in the response from shopping-lists api')
        } catch(err) {
            console.error(err)
            window.alert('Failed to update the list')
            mutate()
        }
    }

    if (error) return <div>Error loading this page, please try again.</div>
    if (!data) return <div>Loading...</div>
    return <div>
            <div>
                <Link href={{pathname: '/'}}><button>&lt;&lt; Back to Meal Planner</button></Link>
            </div>
            <ShoppingListEditor list={data} meals={data.meals} onSaveOrUpdate={onUpdateList}/>
        </div>
}
