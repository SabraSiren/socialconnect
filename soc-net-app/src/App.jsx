
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import { checkAuth } from './store/slices/authSlice';

function App() {
    const dispatch = useDispatch();

    // Проверяем авторизацию при запуске приложения
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <AppRouter/>
        </BrowserRouter>
    );
}

export default App;
