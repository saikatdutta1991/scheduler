# Scheduler
This is a stand-alone service that helps to manage the resource time. It can be used to create an application like doctor booking, hotel room booking, hair cut booking, etc. It is capable of storing bookings for unlimited future days. This service is written in NodeJS

The HTTP REST APIs are pretty simple and straight forward. 200OK for the success response. All the APIs are guarded by an`apiClientToken` that token is required to be passed with each API call in the header `Authorization`.

```
Sample apiClient token
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlBdXRoS2V5IjoiNmEyNzRkZTItZTNiMC00YWM4LWExZTItMWYwYTRlYTc5YWM3Iiwic3ViIjowLCJpc3MiOiJTY2hlZHVsZXIiLCJpYXQiOjE1OTA3NTg1MzJ9.dEpniAzPDtjkpzS8-9qR1Q8toaLMlnCMtzH0OOYF76M
```

Entities :
1. Location - It is the place where a resource does its job.
2. Service - The system can have multiple types of services linked with a location.
3. Resouce - This does the actual job for the given blocked time-slot.
4. Guest - This is the least usable entity. It is just used for showing booking details in the dashboard and keep track of the main application system.
5. Booking - This holds all the bookings made by a user.

Note: All the APIs base is ```{host}/api/v1``` included.

## Installation

### Generate API Client Token
### Environment Setup
### Install Packages
### Environment Setup
#### Sample .env file content
```shell
NODE_ENV=development
PORT=3000
APP_NAME=Scheduler
DB_CONNECTION=pg
DB_HOST=postgresdb
DB_DATABASE=scheduler
DB_USERNAME=postgres
DB_PASSWORD=postgres
FIREBASE_API_KEY=
JWT_SECRET=sOmE_sEcUrE_pAsS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=sOmE_sEcUrE_pAsS
API_AUTH_KEY=6a274de2-e3b0-4ac8-a1e2-1f0a4ea79ac7
```
#### Correct naming of .env files
```shell
 Create .env.development & .env.production files in root directory.
 Clone the .env.sample into above two files and change the values accordingly.
```

### .env.sample
```shell
NODE_ENV=development
PORT=3000
APP_NAME=nodejs-jumpstart
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=nodejs-jumpstart
DB_USERNAME=root
DB_PASSWORD=
DB_PORT=3306
FIREBASE_API_KEY=
JWT_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=nodejs-jumpstart
```

## Run
```javascript
 Open terminal and move to the root directory.  Do the following steps :
 
 # Insall npm dependencies.
 > npm install
 
 # To create migration files
NODE_ENV=development ./node_modules/.bin/knex migrate:make users
 
 # Run migration to create tables
 > NODE_ENV=development ./node_modules/.bin/knex migrate:latest
 
 # To start server
 > npm run dev
 	or
 > npm run prod
 
 *Note :  if heroku set the .env
```
