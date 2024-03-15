import { formatCurrency } from '../../utilities/helpers'

function OrderItem({ item, isLoadingIngredients, ingredients }) {
    const { id, quantity, name, totalPrice } = item

    return (
        <li className="py-3" key={id}>
            <div className="flex items-center justify-between gap-4 text-sm">
                <p>
                    <span className="font-bold">{quantity}&times;</span> {name}
                </p>
                <p className="font-bold">{formatCurrency(totalPrice)}</p>
            </div>
        </li>
    )
}

export default OrderItem
