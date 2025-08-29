
import { Member } from "./member";
import { Product } from "./product";

/*. REACT APP STATE */
export interface AppRootState {
    [x: string]: any;
    homePage: HomePageState;
    productPage: ProductPageState;
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