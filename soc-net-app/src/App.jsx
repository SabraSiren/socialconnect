import {AuthContext} from "./context/AuthContext";
import {useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";

function App() {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState("");

    useEffect(() => {
        if (localStorage.getItem("auth")) {
            setIsAuth(true);
            setUsername(localStorage.getItem("username"))
        }
        setIsLoading(false);
    }, [])


    return (
        <AuthContext.Provider value={{isAuth, setIsAuth, isLoading, username, setUsername}}>
            <BrowserRouter>
                <AppRouter/>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
