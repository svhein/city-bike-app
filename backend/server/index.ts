import express, { Express, Request, Response } from 'express';
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  })

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.get('/getJourneysRows/:start/:end', (req: Request, res: Response) => {

  let starting: number = parseInt(req.params['start']); // first row to get
  let ending: number = parseInt(req.params['end']) // last row to get

  pool.query(`SELECT * FROM journeys LIMIT ${ending - starting} OFFSET ${starting}`, (error: any, result: any) => {
    if (error) {
      throw error
    }
    res.status(200).json(result.rows)
  })
}) 

app.get('/getJourneys/:departurestation/:returnstation', (req: Request, res: Response) => {

  let departureStation: string | null = req.params['departurestation'].toLowerCase();
  let returnStation: string | null = req.params['returnstation'].toLowerCase();

  // If station input is not provided null is sent
  departureStation = departureStation == 'null' ? null : departureStation;
  returnStation = returnStation == 'null' ? null : returnStation;

  console.log('got request ' + departureStation + " " + returnStation);

  if (departureStation && returnStation){
    pool.query(`SELECT * FROM journeys WHERE lower(departurestationname) like '${departureStation}%' and lower(returnstationname) like '${returnStation}%';`, (error: any, result: any) => {
      res.status(200).json(result.rows)
    })
  }
  else if (departureStation){
    pool.query(`SELECT * FROM journeys WHERE lower(departurestationname) like '${departureStation}%';`, (error: any, result: any) => {
      res.status(200).json(result.rows)
    })
  }
  else if (returnStation){
    pool.query(`SELECT * FROM journeys WHERE lower(returnstationname) like '${returnStation}%';`, (error: any, result: any) => {
      res.status(200).json(result.rows)
    })
  }
  else{
    res.status(404).send('Not found')
  }
}) 

app.get('/getStationNames', async (req, res) => {
  let result = await pool.query(`SELECT departurestationname FROM journeys GROUP BY departurestationname;`);
  res.status(200).send(result.rows)
});

app.get('/getStationsRows/:start/:end', (req: Request, res: Response) => {

  let starting: number = parseInt(req.params['start']); // first row to get
  let ending: number = parseInt(req.params['end']) // last row to get

  pool.query(`SELECT departurestationname FROM journeys GROUP BY departurestationname LIMIT ${ending - starting} OFFSET ${starting}`, (error: any, result: any) => {
    if (error){
      throw(error)
    }
    res.status(200).json(result.rows)
  })
}) 

app.get('/getStations/amount', (req: Request, res: Response) => {

  let starting: number = parseInt(req.params['start']); // first row to get
  let ending: number = parseInt(req.params['end']) // last row to get

  pool.query(`SELECT departurestationname FROM journeys GROUP BY departurestationname`, (error: any, result: any) => {
    res.status(200).send(result.rows.length.toString())
  })
}) 

app.get('/getJourneys/amount', (req: Request, res: Response) => {

  let starting: number = parseInt(req.params['start']); // first row to get
  let ending: number = parseInt(req.params['end']) // last row to get

  pool.query(`SELECT count(*) FROM journeys;`, (error: any, result: any) => {
    if (error) {
      throw error
    }
    res.status(200).send(result.rows[0].count)
  })
}) 

app.get('/station/:string', (req: Request, res: Response) => {

  let string: string = req.params['string'].toLowerCase();

  pool.query(`SELECT departurestationname FROM journeys WHERE lower(departurestationname) like '${string}%' GROUP BY departurestationname`, (error: any, result: any) => {
    if (error) {
      throw error
    }
    res.status(200).json(result.rows)
  })
}) 

app.get('/station/:string/data', async(req: Request, res: Response) => {

  let name: string = req.params['string'];

  let departures = await pool.query(`SELECT COUNT(*) FROM journeys WHERE departurestationname='${name}';`);
  let returns = await pool.query(`SELECT COUNT(*) FROM journeys WHERE returnstationname='${name}';`);
  let top_5_departures = await pool.query(`SELECT returnstationname, COUNT(*) FROM journeys WHERE departurestationname='${name}' GROUP BY returnstationname ORDER BY count(*) desc limit 5;`)
  let top_5_arrivals = await pool.query(`SELECT departurestationname, COUNT(*) FROM journeys WHERE returnstationname='${name}' GROUP BY departurestationname ORDER BY count(*) desc limit 5;`)
  let avg_dep_duration = await pool.query(`SELECT AVG(duration) FROM journeys WHERE departurestationname='${name}'`);
  let avg_ret_duration = await pool.query(`SELECT AVG(duration) FROM journeys WHERE returnstationname='${name}'`)
  let avg_dep_distance  = await pool.query(`SELECT AVG(covereddistance) FROM journeys WHERE departurestationname='${name}'`);
  let avg_ret_distance = await pool.query(`SELECT AVG(covereddistance) FROM journeys WHERE returnstationname='${name}'`)
  res.status(200).json({departures: departures.rows, 
                        returns: returns.rows,
                        topDepartures: top_5_departures.rows,
                        topReturns: top_5_arrivals.rows,
                        avgDepDuration: avg_dep_duration.rows,
                        avgRetDuration: avg_ret_duration.rows,
                        avgDepDistance: avg_dep_distance.rows,
                        avgRetDistance: avg_ret_distance.rows});
}) 

app.listen(port, () => {
  console.log(`Server is running`);
});
