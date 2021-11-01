import ImageWithFallback from "../imageWithFallback"

export default function ItemCard({isSelected, item, onSelectItem, onDeselectItem}) {
    return (
        <div className="item"
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
                    <li key={i}>{ Math.round(amount.quantity * 100) / 100 } { amount.measure === "<unit>" ? "" : amount.measure }</li>
                ))}
                </ul>
            </div>
            <style jsx>{`
              .item {
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
            }

            .itemCheckbox {
                width: 1.5rem;
                height: 1.5rem;
            }

            .itemCheckbox:checked {
                box-shadow: 0 0 1em #59d2fe;
            }

            .thumbnail {
                border-radius: 17%;
                overflow: hidden;
                margin-right: 1em;
                margin-left: 1em;
            }

            .title {
                width: 9rem;
                word-break: break-all;
            }

            `}</style>
        </div>
    )
}