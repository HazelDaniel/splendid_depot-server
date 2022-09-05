
import { useContext } from "react";
import { userContext } from "../../App";
import {  __uploadCart } from "../../App.utils";
import { UpdateCartButtonStyled } from "./update_cart_button.styles";

export const UpdateCartButton = ({ clientCartDispatch, clientCartState, $showDisabled }) => {
	const { currentUser: {currentUser} } = useContext(userContext);
	return (
		<UpdateCartButtonStyled disabled={$showDisabled} $showDisabled ={$showDisabled} onClick={() => {
			if (!!currentUser) {
				clientCartDispatch(__uploadCart(clientCartState));
			} else {
				alert("could not update cart , you were not signed in")
			}
		}}
		>UPDATE CART</UpdateCartButtonStyled>
	)
}
export default UpdateCartButton;