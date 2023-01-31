import React, {useState, useEffect} from 'react';
import './Pagination.css'

function Pagination({view, rowsPerPage, currentPage, setCurrentPage, setRowsPerAge}){

    const [journeyAmount, setJourneyAmount] = useState(0);
    const [stationAmount, setStationAmount] = useState(0);
    const [maxJourneyPage, setMaxJourneyPage] = useState(Math.floor(journeyAmount / rowsPerPage));
    const [maxStationPage, setMaxStationPage] = useState(Math.floor(stationAmount / rowsPerPage));

    // Fetch station- and journeys amounts to calculate max pagination page
    useEffect(() =>{
        const fetchStationAmount= async() => {
            await fetch(`https://city-bike-api-u44xl65y7a-lz.a.run.app/getStations/amount`)
                .then(result => result.text())
                .then(result => setStationAmount(result))
        }
        const fetchJourneyAmount = async () => {
            await fetch('https://city-bike-api-u44xl65y7a-lz.a.run.app/getJourneys/amount')
                .then(result => result.text())
                .then(result => setJourneyAmount(result))
        }
        fetchStationAmount();
        fetchJourneyAmount();
    }, [])

    useEffect(() => {
        setMaxJourneyPage(Math.floor(journeyAmount / rowsPerPage));
        setMaxStationPage(Math.floor(stationAmount / rowsPerPage));
    }, [journeyAmount, stationAmount, rowsPerPage])
  

    function handleIncrement(){

        let maxJourneyPages = journeyAmount / rowsPerPage;
        let maxStationPages = stationAmount / rowsPerPage;

        if (view == 'journeys' && currentPage <  maxJourneyPages - 1) {
            setCurrentPage(currentPage + 1)
        }
        if (view == 'stations' && currentPage < maxStationPages - 1){
            setCurrentPage(currentPage + 1)
        }
    }
    

    return(
    <div>
        <select onChange={(e) => setRowsPerAge(e.target.value)}>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
        </select>
    <div className='paginationWrapper'>
        <div className='arrowWrapper' onClick={() => setCurrentPage(0)}>
            {/* <i className="fa fa-angle-double-left"></i> */}
            <p>First</p>
        </div>
        <div className='arrowWrapper' onClick={() => currentPage > 0 ? setCurrentPage(currentPage - 1) : null}>
            <i className="arrow left"></i>
        </div>
        <h3>{(currentPage + 1).toString()}</h3>
        <div className='arrowWrapper' onClick={handleIncrement}>
            <i className="arrow right"></i>
        </div>
        <div className='arrowWrapper' onClick={() => view == 'journeys' ? setCurrentPage(maxJourneyPage) : setCurrentPage(maxStationPage) }>
            {/* <i className="fa fa-angle-double-right"></i> */}
            <p>Last</p>
        </div>
    </div>
    </div>
    )
}

export default Pagination;