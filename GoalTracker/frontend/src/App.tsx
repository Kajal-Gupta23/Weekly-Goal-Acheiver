import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import GroupGoals from './pages/Groups';


function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/groups" element={<GroupGoals />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;