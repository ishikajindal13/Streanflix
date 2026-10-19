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
import { AuthProvider } from './context/AuthContext'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/my-list"
            element={
              <ProtectedRoute>
                <MyList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/movie/:id"
            element={<MovieDetails />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
