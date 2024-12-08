import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SignUppage from "./pages/SignUppage"
import LoginPage from "./pages/LoginPage"
import SettignsPage from "./pages/SettignsPage"
import ProfilePage from "./pages/ProfilePage"
import { Navigate, Route, Routes } from "react-router-dom"
import { useAuthStore } from './store/useAuthStore'
import { Loader } from "lucide-react"
import {useThemeStore} from "./store/useThemeStore"



function App() {
  const [count, setCount] = useState(0)
  const { authUser, chekAuth, isCheckingAuth,onlineUsers } = useAuthStore()
  const {theme,setTheme} = useThemeStore();

  console.log("onlineUsers",onlineUsers);
  useEffect(() => {
    chekAuth()
  }, [chekAuth])
  console.log("this is authuser from app.jsx :-",authUser);
  console.log("this is : - " , isCheckingAuth)

  if (isCheckingAuth && !authUser) {
    return(<div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>)
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Home />:<Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser?<SignUppage />:<Navigate to="/"/>} />
        <Route path="/login" element={!authUser?<LoginPage />:<Navigate to="/"/>} />
        <Route path="/settings" element={<SettignsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage />:<Navigate to="/login"/>} />

      </Routes>

    </div>
  )
}

export default App
