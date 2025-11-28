import {AuthProvider} from "./context/AuthContext";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRouter/>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
