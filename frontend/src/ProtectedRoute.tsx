import {Navigate, Outlet} from "react-router-dom";

export type ProtectedRouteProps = {
    user:string|undefined|null;
}

export default function ProtectedRoute(props:Readonly<ProtectedRouteProps>) {
    if(props.user === undefined) {
        return <h3>loading...</h3>
    }

    return(
        props.user ? <Outlet/> : <Navigate to={"/"}/>
    )
}