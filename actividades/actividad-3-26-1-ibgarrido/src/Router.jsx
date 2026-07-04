import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login';
import UserProfile from './pages/user';

function Router(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<LoginPage/>}/>
        <Route path={"/user"} element={<UserProfile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Router;