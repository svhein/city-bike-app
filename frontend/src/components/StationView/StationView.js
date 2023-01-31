import React, {useEffect, useState} from 'react';
import './StationView.css';

function StationView({stationName, setStationView}){

    const [data, setData] = useState(null);

    useEffect(() => {
        setData(null)
        const fetchData = async () => {
            console.log('fetching station: ' + stationName)
            await fetch(`https://city-bike-api-u44xl65y7a-lz.a.run.app/station/${stationName}/data`)
                .then(res => res.json())
                .then(res => setData(res))
        }
        fetchData();
    },[stationName])

    function formatTime(seconds_string){
        let seconds = parseInt(seconds_string);
        let minutes = Math.floor(seconds / 60);
        let sec_left = Math.floor(seconds % 60);

        return String(`${minutes} minutes and ${sec_left} seconds`)
    }

    function formatDistance(distance_string){
        let distance = parseFloat(distance_string);
        distance = (distance / 1000).toFixed(2); // distance to kilometers
        return distance;
    }

    if(data){
        console.log(data)
        let departureCount = data.departures[0].count;
        let returnCount = data.returns[0].count;
        let topDepartures = data.topDepartures; // Array of objects
        let topReturns = data.topReturns; // Array of objects
        let avgDepDuration = data.avgDepDuration[0].avg
        let avgRetDuration = data.avgRetDuration[0].avg
        let avgDepDistance = data.avgDepDistance[0].avg
        let avgRetDistance = data.avgRetDistance[0].avg
        return (
        
            <div className='stationView'>
                <h2>{stationName}</h2>
                <div className='topRow'>
                    <div className = 'topDepartures'>
                        <h3>Journeys from here</h3>
                       {topDepartures.map(station => {
                            return (
                                <div className = 'top_list_row' onClick={() => setStationView(<StationView  stationName={station.returnstationname} setStationView={setStationView} />)}>
                                    <p>{station.returnstationname}</p> <p>{station.count}</p>
                                </div>
                            )
                       })}
                       <h5>Total {departureCount}</h5>
                    </div>
                    <div className = 'topReturns'>
                        <h3>Journeys to here</h3>
                       {topReturns.map(station => {
                            return(
                                // <li>{station.departurestationname} {station.count} trips</li>
                                <div className = 'top_list_row'  onClick={() => setStationView(<StationView  stationName={station.departurestationname} setStationView={setStationView} />)}>
                                    <p>{station.departurestationname}</p> <p>{station.count}</p>
                                </div>

                            )
                       })}
                       <h5>Total {returnCount}</h5>
                    </div>
                </div>
                <div className = 'avg_distance'>
                    <p>Avarage journey from this station is <b>{formatDistance(avgDepDistance)} kilometers</b> long and takes  <b>{formatTime(avgDepDuration)} </b></p>
                </div>
                <div className = 'avg_distance'>
                    <p>Avarage journey to this station is <b>{formatDistance(avgRetDistance)} kilometers</b> long and takes  <b>{formatTime(avgRetDuration)} </b></p>
                </div>
    
    
            </div>
        )
    }
    else return (<p>Loading...</p>);

}

export default StationView;