
import { Member } from "./member";
import { Product } from "./product";

/*. REACT APP STATE */
export interface AppRootState {
    homePage: HomePageState;
}



/*. HOME PAGE STATE */
export interface HomePageState {
popularDishes: Product[];
newDishes: Product[];
topUsers: Member[];
}

/*. PRODUCT PAGE STATE */


/*. ORDER PAGE STATE */