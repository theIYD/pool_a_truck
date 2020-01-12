# Truck Pool

#### `POST /journey`

```
Params:
- vehicleId
- userId

FormData:
- sourceLat
- sourceLng
- destLat
- destLng
- capacityAvailable
- departure
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

#### `POST /user`
```
FormData:
- name
- phone

Creates a user in db
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
- departure

Params:
- userId

Registers a new request to the db
```
