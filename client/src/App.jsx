import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import MyList from './pages/MyList'
import MovieDetails from './pages/MovieDetails'
import './App.css'


function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/my-list" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
    <Route path="/movie/:id" element={<MovieDetails />} />
   
   </Routes>
   </BrowserRouter>

  )
}

export default App
