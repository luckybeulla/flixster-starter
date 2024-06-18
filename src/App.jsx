import { useState } from 'react'
import './App.css'
import MovieList from "./Components/MovieList";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <div className="App"> 
      <Header/>
      <MovieList/>
      <Footer/>
    </div>)
}

export default App
