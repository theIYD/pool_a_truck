# Truck Pool

#### `POST /journey`

```
Params:
- userId

FormData:
- sourceLat
- sourceLng
- destLat
- destLng
- capacityAvailable
- departure
- vehicleModel
- vehicleLicensePlate
- polyline (Received from Directions API on the client)

It creates a new journey of a truck from source to destination. Created by the agency
```

#### `GET /journeys`

```
FormData:
- capacityRequired
- source {lat, lng}
- dest {lat, lng}

Gets a list of journeys near the source location of the farmer
```

#### `GET /journeys/all`

```
Gets a list of all the journeys in the database
```

#### `POST /journey/accept`

```
Params:
- journeyId
- requestId

Accept the request for a particular journey
```

#### `POST /user`

```
FormData:
- name
- phone

Creates a user in db
```

#### `POST /login`

```
FormData:
- phone

Logs in a user
```

#### `POST /vehicle`

```
FormData:
- type (Tata)

Creates a new vehicle in db
```

#### `POST /request`

```
FormData:
- sourceLat
- sourceLng
- destLat
- destLng
- capacity
- departureStart (Date)
- departureEnd (Date)

Params:
- userId

Registers a new request to the db
```

#### `GET /requests`

```
Params:
- userId

Gets a list of requests for a particular user
```
