import fetch from 'node-fetch';
import React, {useState, useEffect} from 'react';
import './App.css';
import Searchbox from './components/Searchbox/Searchbox';
import Pagination from './components/Pagination/Pagination'
import StationView from './components/StationView/StationView';
import MainPage from './components/MainPage/MainPage';
import { Route, Routes } from 'react-router-dom';

function App() {

  const [stationView, setStationView] = useState(null); // Single station view

  return(
    <Routes>
      <Route path="/" element={<MainPage setStationView={setStationView} />} />
      <Route path="/station" element={stationView} />
    </Routes>
  )
  
}

export default App;
