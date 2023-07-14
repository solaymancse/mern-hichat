import { useContext } from "react"
import { Register } from "./Register"
import { UserContext } from "./UserContext"
import { Chat } from "./Chat";


export const Routes = () => {
    const {username, id} = useContext(UserContext);
    if(username){
        return <Chat/>;
    }
  return (
    <Register/>
  )
}
