import styles from './RecipeSearch.module.css'
import Link from 'next/link'
import Image from 'next/image'

export default function RecipeCard ({ recipe, onPlan, addToPlan }) {
    const { image, url, source, label } = recipe
    return <div className={styles.recipeCard}>
        <Link href={url}>
            <Image src={image} height={300} width={300} alt={`Picture of ${label}`} />
        </Link>
        <p><a href={url} target="_blank">
            {label}
        </a></p>
        { !onPlan
            ? <button onClick={() => addToPlan(recipe)}>Add to Plan</button>
            : <button disabled> &#10003; On Plan</button>
        }
        <address>Source: {source}</address>
    </div>
}
