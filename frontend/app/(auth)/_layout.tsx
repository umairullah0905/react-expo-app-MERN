import { Redirect, Slot, Stack } from "expo-router";
import { useAuth } from "../context/AuthContext"; 

export default function AuthLayout(){

    const {isAuthenticated} = useAuth();

    if(isAuthenticated){
        <Slot/>
        return <Redirect href={'/'}/>;
    }


    return <Stack/>;
}