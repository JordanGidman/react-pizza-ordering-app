import { useLoaderData } from 'react-router-dom'
import { getMenu } from '../../services/apiRestaurant'
import MenuItem from './MenuItem'

function Menu() {
    const menu = useLoaderData()
    console.log(menu)

    return (
        <ul className="divide-y divide-stone-200 px-2">
            {menu.map((pizza) => (
                <MenuItem pizza={pizza} key={pizza.id} />
            ))}
        </ul>
    )
}

//loading menu data from an api using loader which is from react-router and makes it so that the fetch and render happen at the same time by passing this loader to our browser router
export async function loader() {
    const menu = await getMenu()
    return menu
}

export default Menu
