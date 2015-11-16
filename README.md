# doc
A front end for the document management system api, built using Angular JS and Angular Material Design, (visit [here](http://do-c.herokuapp.com) for more).

## IMPORTANT

**You need node v0.8 or higher to run this program.**

**You need gulp installed globally, RUN `npm install -g gulp`**

# Project Setup
## Run

  - Start by cloning the repo
  - Checkout to `master` branch
  - Install the dependencies: `npm install`

```
  $ git clone https://github.com/andela-abankole/doc.git
  $ cd doc
  $ git checkout stage
  $ npm install 
```
This will install all `dependencies` and `dev-dependencies`.

###### Run the app:

 - Start mongod
 - Type `gulp`
 - You should see a message `Success: http://localhost:3000`
 - Open your browser and visit `http://localhost:3000`

```
  $ gulp
  
  Navigate to http://localhost:3000 to view the live app.
```

Test it out. Once done, kill the server to Test

## Test

  - Checkout to `Test` branch

```
  $ git checkout Test
```

#### Run the tests:

 - Open a terminal window **1**.
 - Run `$ gulp`.
 - You should see a message `Success: http://localhost:3000`.
 - Open another terminal window **2**, RUN `$ gulp test`.