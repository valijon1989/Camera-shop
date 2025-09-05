
import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";

/*. REACT APP STATE */
export interface AppRootState {
    [x: string]: any;
    homePage: HomePageState;
    productPage: ProductPageState;
    orderPage:OrdersPageState
}



/*. HOME PAGE STATE */
export interface HomePageState {
popularDishes: Product[];
newDishes: Product[];
topUsers: Member[];
}

/*. PRODUCT PAGE STATE */
export interface ProductPageState {
    restaurant: Member | null;
    chosenProduct: Product | null;
    products: Product[];
}

/*. ORDER PAGE STATE */
export interface OrdersPageState {
    pausedOrders: Order[];
    processOrders: Order[];
    finishedOrders: Order[];
}