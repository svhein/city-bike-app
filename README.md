# city-bike-app

My pre-assigment solution for [Solita Dev Academy Finland 2023](https://github.com/solita/dev-academy-2023-exercise).
The object was to create web application that displays journeys made with city bikes in the Helsinki Capital area.

Web app: [https://city-bike-app-6c728.firebaseapp.com/](https://city-bike-app-6c728.firebaseapp.com/)

## Solution

* Node.js app for fetching data
* PostgreSQL Database hosted in Google Cloud SQL
* Express API hosted in Google Cloud Run
* Frontend app made with React

##

### React app

* Contains search functionality, simple pagination and a table
* Open station view by clicking station name
* Sort journeys based on duration or distance by clicking table header

##

### Node app

* Fetches csv files from provided URLs
* Parses and valides data
* Sends data to database

##

### API Endpoints

|                      URL                      	| Method 	|        	| Description                                                                                                                   	|
|:---------------------------------------------:	|--------	|--------	|-------------------------------------------------------------------------------------------------------------------------------	|
| /getJourneysRows/:start/:end                  	| GET    	| JSON   	| database journeys (rows) at range {start} to {end}                                                                            	|
| /getJourneys/:departurestation/:returnstation 	| GET    	| JSON   	| journeys where departure station contains string in {departurestation} and return station contains string in {returnstation}  	|
| /getJourneys/amount                           	| GET    	| STRING 	| number of journeys in database                                                                                                	|
| /getStationNames                              	| GET    	| ARRAY  	| array of station names in database                                                                                            	|
| /getStations/amount                           	| GET    	| STRING 	| number of stations in database                                                                                                	|
| /getStationRows/:start/:end                   	| GET    	| JSON   	| names of stations at range {start} to {end}                                                                                   	|
| /station/:string/data                         	| GET    	| JSON   	| station data                                                                                                                  	|
