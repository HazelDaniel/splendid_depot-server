import { React, useEffect, useRef } from "react";
import "./App.scss";
import Wrapper from "./components/wrapper/wrapper.component";
// FIREBASE
import { onAuthStateChanged } from "firebase/auth";
import { auth, createUserProfileDocument } from "./firebase/firebase.utils";
import { getDoc, onSnapshot } from "firebase/firestore";
// REDUX
import { updateUser } from "./redux/user/user.slice";
import { renderWelcome, unmountWelcome } from "./redux/app/app.slice";
import {useDispatch } from "react-redux";
import { unmountLoader, renderLoader } from "./redux/app/app.slice";
// UTILS
import { wait } from "./utils";

let unsubscribeFromAuth;
let unsubscribeFromSnapshot;
const App = (_) => {
	const dispatch = useDispatch();
	useEffect(() => {
		try {
			unsubscribeFromAuth = onAuthStateChanged(auth, async (userAuth) => {
				if (userAuth) {
					try {
						dispatch(renderLoader());
						const userRef = await createUserProfileDocument(userAuth);
						// console.log(userRef);
						let userSnapshot = await getDoc(userRef);
						unsubscribeFromSnapshot = onSnapshot(userRef, () => {
							const userData = {
								id: userRef.id,
								...userSnapshot.data(),
								currentUser: userAuth,
							};

							dispatch(updateUser(JSON.parse(JSON.stringify(userData))));
						});
					} catch (error) {
						throw error;
					} finally {
						dispatch(unmountLoader())
					}
					// console.log(userAuth.displayName.split(" ")[1])
					dispatch(renderWelcome());
					await wait(3);
					// dispatch(unmountWelcome());
					dispatch(unmountWelcome());
				} else {
					// this.setState({currentUser: userAuth})
					dispatch(updateUser({ currentUser: userAuth }));
				}

				//TODO: IMPLEMENT A "WELCOME, USER.DISPLAY_NAME , CLICK HERE TO GO TO ..." POPUP MESSAGE ,  WHICH SHOULD HAPPEN ONLY ONCE (WILL NOT HAPPEN HERE IN THIS BLOCK)
			});
		} catch (error) {
			console.log(error);
		}
		return () => {
			unsubscribeFromAuth();
			unsubscribeFromSnapshot();
		}
	}, [dispatch]);

	return <Wrapper />;
};

export default App;