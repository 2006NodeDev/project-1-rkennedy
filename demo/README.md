Astrology App - Relationship Forcast
Astrology App looks into the stars to predict the wellfare of relationships, no matter the type. Whether you're curious about your new co-worker, girlfriend, or even your family, look no further than our relationship forecast.

Models
User
The User model keeps track of users information.

{
  userId: number, // primary key
	username: string, // not null, unique
	password: string, // not null
	firstName: string, // not null
	lastName: string, // not null
	email: string, // not null
	role: Role // not null
}
Role
The Role model is used to track what permissions a user has.

{
  roleId: number, // primary key
  role: string // not null, unique
}

Relationship
This table holds the potential relationship types and their id
{
  relationshipId: number, //primary key
  relationship: String //not null
}

Profile
The Profile's here are owned by a user and represent a person.
{
  profileId: number, //primary key
	ownerId: number, //references users (userId)
	fullName: String //not null
	relationship: number, //references relationship (relationshipId)
	birthDate: date, //not null
	birthLocation String //not null
}

Sign
Stores the zodiac sign, it's element, and id
{
  signId: number, //primary key
  sign: String, //not null
  element: String //not null
}

House
Stores the Profile's House data including, ID, ASC,IC, DSC, MC
{
  houseId: number, //primary key
  ASC: sign, //not null
  IC:  sign, //not null
  DSC:  sign, //not null
  MC:  sign //not null
}

BirthChart
A Profile's BirthChart data calculated from their birthday.
{
  profileId: number, //primary key, foriegn key
  sun:  sign, //not null
  moon:  sign, //not null
  mercury:  sign, //not null
  venus:  sign, //not null
  mars:  sign, //not null
  jupiter:  sign, //not null
  saturn:  sign, //not null
  uranus:  sign, //not null
  neptune:  sign, //not null 
  pluto:  sign, //not null
  node:  sign, //not null
  lilith:  sign, //not null
  chiron:  sign, //not null
  houses: number //foriegn key to house(houseId)
}



Endpoints
Security
Security should be handled through session storage. If a user does not have permission to access a particular endpoint it should return the following:

Status Code: 401 UNAUTHORIZED
Content:
{
  "message": "The incoming token has expired"
}
Occurs if they do not have the appropriate permissions.
Available Endpoints
Retreives users from the database

Login
URL /login

Method: POST

Request:

{
  username: string,
  password: string
}
Response:

  User
Error Response

Status Code: 400 BAD REQUEST
{
  message: "Invalid Credentials"
}
Find Users
URL /users

Method: GET

Allowed Roles admin

Response:

[
  User
]
Find Users By Id
URL /users/:id

Method: GET

Allowed Roles admin, user or if the id provided matches the id of the current user

Response:

[
  User
]
Update User
URL /users

Method: PATCH

Allowed Roles admin, user

Request The userId must be present as well as all fields to update, any field left undefined will not be updated.

  User
Response:

  User
Find Profiles By User
 Profile should be ordered by fullName

URL /profile/author/owner/:ownerId

Method: GET

Allowed Roles admin, user

Response:

[
  Profile
]

Method: GET

Allowed Roles admin, user or if ther userId is the user making the request.

Response:

[
Profile
]
Submit Profile
URL /profile

Method: POST

Request: The profileId should be 0

  Profile
Response:

Status Code 201 CREATED
  Profile
Update Profile
URL /profile

Method: PATCH

Allowed Roles admin, user

Request The profileId must be present as well as all fields to update, any field left undefined will not be updated.

  Profile
Response:

  Profile
Architecture Requirements
Website must be deployed in a Cloud Storage bucket acting as a web server
Server will be built with express and deployed on Google Compute Engine
Server should be in a managed instance group with elastic scaling based on user demand
Access to the server will be through Cloud Load balancing, with either http or https
Express server should connect to Cloud Pub Sub to send asynchronous messages to relevant services
Cloud Function should be used for extraneous operations
Content Requirements
Website should allow a user to access the functionality of the server
Server should send important update through Cloud Pub Sub for other services
Should have at least one Cloud Function that does something interesting
Must support users having at least one image related to them (profile picture), with images stored in Cloud Storage
Functionality Requirements (Users)
Users can create new accounts with the website [POST]
Users can login through the website [POST]
Users can see and update/edit their profile information [PATCH]
Users can see and update/edit their profile picture [PATCH]
Something (feature/functionality) of my choosing
Technology Requirements
Compute Engine
Cloud Load Balancing
Cloud Storage (AWS or GCP)
Persistent Disk
VPC (Virtual Private Cloud - Amazon or Google)
Cloud Pub Sub
Cloud Function (GCP)
Cloud SQL
Express Server
React JS
PostgreSQL Database
Pg (Postgres) or Knex for Queries
Redux is optional