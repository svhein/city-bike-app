import fetch from 'node-fetch';
import React, {useState, useEffect} from 'react';
import './MainPage.css';
import Searchbox from '../Searchbox/Searchbox';
import Pagination from '../Pagination/Pagination'
import StationView from '../StationView/StationView';
import { Route, Routes, useNavigate } from 'react-router-dom';

function MainPage({ setStationView }) {

  const [text, setText] = useState(null);
  const [view, setView] = useState('journeys')
  const [rowsPerPage, setRowsPerAge] = useState(25);
  const [currentPage, setCurrentPage] = useState(0); 
  const [journeys, setJourneys] = useState([]);
  const [stations, setStations] = useState([]); 
//   const [stationView, setStationView] = useState(null); // Single station view
  const [sortBy, setSortBy] = useState(null);
  //https://city-bike-api-u44xl65y7a-lz.a.run.app

  const navigate = useNavigate();

  useEffect(() => {

    // calculate which rows to fetch with paramiters provided from pagination
    let start = parseInt(currentPage) * parseInt(rowsPerPage);
    let end = parseInt(currentPage) * parseInt(rowsPerPage) + parseInt(rowsPerPage);
 
    const fetchJourneys = async () => {
      let journeys = await fetch(`https://city-bike-api-u44xl65y7a-lz.a.run.app//getJourneysRows/${start}/${end}`);
      journeys = await journeys.json();
      setJourneys(journeys);
    }
    const fetchStations = async() => {
      let stations = await fetch(`https://city-bike-api-u44xl65y7a-lz.a.run.app/getStationsRows/${start}/${end}`);
      stations = await stations.json();
      setStations(stations);
    }
    fetchStations();
    fetchJourneys();

  }, [currentPage, rowsPerPage])

  function formatTime(seconds_string){
    let seconds = parseInt(seconds_string);
    let minutes = Math.floor(seconds / 60);
    let sec_left = Math.floor(seconds % 60);

    return String(`${minutes} minutes and ${sec_left} seconds`)
}

  // Sort journeys when sortBy hook is changed by on table header click
  useEffect(() => {
    if(sortBy){
      let copy = JSON.parse(JSON.stringify(journeys))
      let sorted = copy.sort((a, b) => {
        switch(sortBy){
          case 'distance':
            return b.covereddistance - a.covereddistance;
          case 'duration':
            return b.duration - a.duration;
        }
      })
      setJourneys(sorted)
    }
  }, [sortBy])

  // Component for view == 'journeys'
  function Journeys(){
    return(
      <div className = 'journeysTable'>
          <table>
            <tr>
              <th>Departure Stasion</th>
              <th>Return Station</th>
              <th id='clickable_th' onClick={() => setSortBy('distance')}>Distance (m)</th>
              <th id='clickable_th' onClick={() => setSortBy('duration')}>Duration</th>
            </tr>
            {journeys.map(journey => {
              return (
                <tr>
                  <td id='td_click' onClick={() => {
                    setStationView(<StationView stationName={journey.departurestationname} setStationView={setStationView}/>);
                    navigate("/station")
                    }}>
                    {journey.departurestationname}</td>
                  <td id='td_click' onClick={() => {
                    setStationView(<StationView stationName={journey.returnstationname} setStationView={setStationView}/>);
                    navigate("/station")
                    }}>
                    {journey.returnstationname}</td>
                  <td>{journey.covereddistance}</td>
                  <td style={{textAlign: "center"}}>{formatTime(journey.duration)}</td>
              </tr>
              )
            })}
          </table>
        </div>
    )
  }

  // Component for view == 'stations'
  function Stations(){
    return(
    <div className = 'stationsTable'>
      <table>
        <tr>
          <th>Station Name</th>
        </tr>
        {stations.map(station => {
          return (
            <tr id='stationListRow' onClick={() => {
                setStationView(<StationView stationName={station.departurestationname} setStationView={setStationView}/>);
                navigate("/station");   
                }}>
              {station.departurestationname}
            </tr>
          )
        })}
      </table>
    </div>
    )
  }

  return (
    <div className="App">
      <div className='wrapper'>
        <Searchbox view={view} setView={setView} stations={stations} setStations={setStations} setJourneys={setJourneys}/>
        <Pagination view={view} rowsPerPage={rowsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} setRowsPerAge={setRowsPerAge}/>
        {view == 'journeys' ? <Journeys /> : Stations()}
      </div>
      {/* {stationView ? stationView : null} */}
    </div>
  );
}

export default MainPage;
