import * as fs from 'fs';
require('dotenv').config()
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  })

type Journey  = {
    startTime: string;
    endTime: string;
    departureStationId: number;
    departureStationName: string;
    returnStationId: number;
    returnStationName: string;
    coveredDistance: number;
    duration: number;
}


let journeys: Journey[] = [];

let urls: string[] = ['https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv',
                    'https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv',
                    'https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv']


async function fetchData(url: string){
    const res = await fetch(url)
    const text = await res.text();
    return text; 
}

/** Sends journeys to database
 *  
 * @param data Array of journeys 
 */
const insertData = async(data: Journey[]) => {
    const client = await pool.connect();

    // creare table
    client.query(`CREATE TABLE journeys (
        startTime TIMESTAMP,
        endTime TIMESTAMP,
        departureStationId INTEGER,
        departureStationName VARCHAR(255),
        returnStationId INTEGER,
        returnStationName VARCHAR(255),
        coveredDistance INTEGER,
        duration INTEGER
    );`)

    try{
        client.query('BEGIN');
        console.log('Begin to send data')
        for (let i = 0; i < data.length; i++){
            i % 10000 == 0 ? console.log(i) : null;
            const {startTime, endTime, departureStationId, departureStationName, returnStationId, returnStationName,
                coveredDistance, duration} = data[i];
            await client.query(`INSERT INTO journeys (startTime, endTime, departureStationId, departureStationName, returnStationId, returnStationName, coveredDistance, duration)
             VALUES ('${startTime}', '${endTime}', ${departureStationId}, '${departureStationName}', ${returnStationId}, '${returnStationName}', ${coveredDistance}, ${duration})`) 
        }
        await client.query('COMMIT');
    } catch (e){
        console.log(e)
        // Discard made commits
        await client.query('ROLLBACK')
    } finally{
        client.release();
    }

}


async function main(){

    for (let url of urls){
        console.log('fetching ', url)
        let data = await fetchData(url);

        const rows: string[] = data.split(/\r?\n/);

        for (let i = 1; i < rows.length; i++){
            let dataRow = rows[i].split(",");
            
            let journey: Journey = {
                startTime: dataRow[0],
                endTime: dataRow[1],
                departureStationId: parseInt(dataRow[2]),
                departureStationName: dataRow[3],
                returnStationId: parseInt(dataRow[4]),
                returnStationName: dataRow[5],
                coveredDistance: parseInt(dataRow[6]) / 1000,
                duration: parseInt(dataRow[7])
            }

            // gather journeys to array
            if (!(journey.coveredDistance < 10)){
                if(!(Object.values(journey).includes(undefined|| NaN))){
                    journeys.push(journey);
                }
            }
        }
    }  
    console.log('Fetching done');
    console.log('Sending data to db')
    await insertData(journeys);

}

main();







