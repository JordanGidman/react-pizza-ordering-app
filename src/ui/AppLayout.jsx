import { Outlet, useNavigation } from 'react-router-dom'
import CartOverview from '../features/cart/CartOverview'
import Header from './Header'
import Loader from './Loader'

function AppLayout() {
    //This will return an object, one of the properties of this is the state, which we can use to tell if router is in the middle of loading a page to then display a loading component
    const navigation = useNavigation()
    const isLoading = navigation.state === 'loading'

    return (
        <div className="grid h-screen grid-rows-[auto_1fr_auto] ">
            {isLoading && <Loader />}

            <Header />
            <div className="overflow-scroll">
                <main className="mx-auto max-w-3xl ">
                    {/* This component will render whatever our current child route is, which is why they are all structured as children of the AppLayout route */}
                    <Outlet />
                </main>
            </div>

            <CartOverview />
        </div>
    )
}

export default AppLayout
