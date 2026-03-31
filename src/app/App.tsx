import React, { useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import  HomePage  from "./screens/homePage";
import ProductsPage from "./screens/productsPage";
import OrdersPage from "./screens/ordersPage";
import UserPage from "./screens/userPage";
import HomeNavbar from "./components/headers/HomeNavbar";
import OtherNavbar from "./components/headers/OtherNavbar";
import  Footer  from "./components/footer";
import  HelpPage  from "./screens/helpPage";
import AddProduct from "./screens/addProduct";
import BrandPage from "./screens/brandPage";
import useBasket from "./hooks/useBasket";
import AuthenticationModal from "./components/auth";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../lib/sweetAlert";
import { Messages } from "../lib/config";
import MemberService from "./services/MemberService";
import { useGlobals } from "./hooks/useGlobals";
//@ts-ignore 
import "../css/app.css";
//@ts-ignore 
import "../css/navbar.css";
//@ts-ignore 
import "../css/footer.css";

function App() {
     const location = useLocation();
     const {setAuthMember} = useGlobals();
     const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
     const [signupOpen, setSignupOpen] = useState<boolean>(false);
      const [loginOpen, setLoginOpen] = useState<boolean>(false);
      const [anchorEl, setAnchorEl] = useState<HTMLElement | null >(null);



      //** HANDLERS **/
      const handleSignupClose = () => setSignupOpen(false);
      const handleLoginClose = () => setLoginOpen(false);

        const handleLogoutClick = (e: React.MouseEvent<HTMLImageElement>) => {
        setAnchorEl(e.currentTarget);
       };
 
      const handleLogoutClose = () =>  setAnchorEl(null);
      const handleLogoutRequest = async () => {
        try {
      const member = new MemberService();
      await member.logout();
      await sweetTopSmallSuccessAlert("success", 700);
      setAuthMember(null);
      } catch (err) {
          sweetErrorHandling(Messages.error1).then();
        }
      }

  return (
    <> 
    {location.pathname === "/" ? ( 
      <HomeNavbar 
      cartItems={cartItems} 
      onAdd={onAdd}
      onRemove={onRemove}
      onDelete={onDelete} 
      onDeleteAll={onDeleteAll}
      setSignupOpen={setSignupOpen}
      setLoginOpen={setLoginOpen}
      anchorEl={anchorEl}
      handleLogoutClick={handleLogoutClick}
      handleLogoutClose={handleLogoutClose}
      handleLogoutRequest={handleLogoutRequest}
      />
    ) :(
     <OtherNavbar 
     cartItems={cartItems}
      onAdd={onAdd}
      onRemove={onRemove}
      onDelete={onDelete}
      onDeleteAll={onDeleteAll}
      setSignupOpen={setSignupOpen}
      setLoginOpen={setLoginOpen}
      anchorEl={anchorEl}
      handleLogoutClick={handleLogoutClick}
      handleLogoutClose={handleLogoutClose}
      handleLogoutRequest={handleLogoutRequest}
      />
    )}
        <Switch>
          <Route path="/cameras">
            <ProductsPage onAdd={onAdd}/>
          </Route>
          <Route path="/orders">
            <OrdersPage />
          </Route>
          <Route path="/brand/:brandName">
            <BrandPage />
          </Route>
          <Route path="/member-page">
            <UserPage />
          </Route>
          <Route path="/help">
            <HelpPage />
          </Route>
          <Route path="/add-product">
            <AddProduct />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
        <Footer />
        <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleSignupClose={handleSignupClose}
        handleLoginClose={handleLoginClose}
      />
      </>
  );
}








export default App;
