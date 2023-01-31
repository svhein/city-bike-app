
import React, {useState, useEffect} from 'react'
import './Searchbox.css'
import { InputSuggestions } from 'react-input-suggestions'

function Searchbox({view, setView, stations, setStations, setJourneys}){

    const [departureStation, setDepartureStation] = useState("");
    const [returnStation, setReturnStation] = useState(""); 
    const [station, setStation] = useState(""); //store  string to search input
    const [stationNames, setStationNames] = useState([]);

    useEffect(() => {
        getStationNames();
    }, [])

    function handleChange(e){
        setView(e.target.value)
        console.log(e.target.value);
        return
    }

    async function searchJourneys(){
        let dep_station = departureStation ? departureStation : 'null';
        let ret_station = returnStation ? returnStation  : 'null';
        console.log(`https://city-bike-api-u44xl65y7a-lz.a.run.app/getJourneys/${dep_station}/${ret_station}`)
        await fetch(`https://city-bike-api-u44xl65y7a-lz.a.run.app/getJourneys/${dep_station}/${ret_station}`)
            .then(results => results.json())
            .then(results => setJourneys(results))
        
    }

    async function searchStation(string){
        await fetch(`https://city-bike-api-u44xl65y7a-lz.a.run.app/station/${string}`)
            .then(results => results.json())
            .then (results => setStations(results))
    }

    async function getStationNames(){
        await fetch('https://city-bike-api-u44xl65y7a-lz.a.run.app/getStationNames')
            .then(result => result.json())
            .then(result => result.names)
            .then(result => setStationNames(result))
    }

    function JourneySearch(){

        return (
            <div className='searchForm'>
                <div>
                <label>
                    Departure station:
                    <input type='text' value={departureStation} onChange={(e) => setDepartureStation(e.target.value)}></input>
                </label>
                </div>
                <label>
                    Return station:
                    <input type='text' value={returnStation}  onChange={(e) => setReturnStation(e.target.value)}></input>
                </label>
                <button className="searchButton" onClick={searchJourneys}>
                    Search
                </button>
            </div>
        )
    }

    function StationSearch(){

        return (
            <div className='searchForm'>
                <label>
                    Station Name
                    <input type='text' value={station} onChange={(e) => setStation(e.target.value)}></input>
                </label>
                <button className="searchButton" onClick={() => searchStation(station)}>
                    Search
                </button>
            </div>
        )
    }


    return (

        <div className='searchWrapper'>
            <div className='radioDiv' onChange={handleChange}>
                <input type='radio' value='journeys' name='journeys' defaultChecked/> Journeys
                <input type='radio' value='stations' name='journeys' /> Stations
            </div>
            {view == 'journeys' ? JourneySearch() : StationSearch()}
        </div>
    )

}

export default Searchbox;