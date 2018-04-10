# OurWish

**OurWish** makes it possible for you to find your perfect date. You are the one who know's your interests the best and now you are able to connect to people who will fit in your perfectly to your preferences.


![screenhot](https://github.com/RobinStut/be-assessment-02/blob/master/static/image/Schermafbeelding%202018-04-10%20om%2012.33.26.png)
![screenshot](https://github.com/RobinStut/be-assessment-02/blob/master/static/image/Schermafbeelding%202018-04-10%20om%2012.56.41.png)
## How to install

To install **OurWish**, open up bash and type the following codes: 

```
git clone https://github.com/RobinStut/be-assessment-02
cd be-assessment-02/
npm install
npm start
visit localhost:8000 in your browser
```

## How to run the database

The data of **OurWish** will be stored in a programm called MongoDB. 
To install and run database, open a new terminal tab, and type the following codes: 

```
brew install 
brew install mongodb
brew services start mongodb
mongod --dbpath db
mongo
use OurWish
The port this project is made on is :27017
```

## To-do

- [x] Getting server and database working (hello world)
- [x] Showing data from database in ejs
- [ ] Upload, modify and delete data
- [ ] Users can log in and sign up (using sessions)
- [ ] Users can search
- [ ] Matching users
- [ ] Starting a chat
- [ ] Chatting


## Routes
in case you got lost: 

`localhost:8000` 'starting' page, with links to login and sign-up forms.

`localhost:8000/matches` page with all your matches

`localhost:8000/inbox` page with all your chats

`localhost:8000/profile` page with your profile


## Packages 

- [Ejs](https://github.com/tj/ejs) 
- [Ejs-lint](https://github.com/RyanZim/EJS-Lint) 
- [Express](https://github.com/expressjs/express) 
- [Mongodb](https://github.com/mongodb/mongo) 


## Major Credits

The teachers who helped me out when I couldn't fix my own problems are [Titus Wormer](https://github.com/wooorm) and [Laurens Aarnoudse](https://github.com/Razpudding). Please check their github and start following them!
