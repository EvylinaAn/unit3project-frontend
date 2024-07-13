# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Description

My third project at General Assembly was a group project, where we were randomly placed in groups of 3 to get a better understanding of a work environment and working as a team. The project could be any CRUDable application with user authentication using the MERN stack. My team and I decided to build a day planner that would allow a user to log their To-Dos, Schedule and Daily Checks i.e water intake, sleep, mood and quote.


### Deployment link

Find the deployment link here


### Getting Started/Code Installation

Backend is hosted on localhost4000 -

Run the command npm install to install the dependencies.

Then run npm start to run the localhost.

Frontend is hosted on localhost3000 -

Run the command npm install to install the dependencies in the frontend.

Then run npm start to run localhost


### Timeframe & Working Team (Solo/Pair/Group)

This was a group project where I collaborated with Mafalda Ventura and Patrick Quayle to come up with a fully functional application within 1 week.


### Technologies Used

Frontend - HTML, CSS, JavaScript, React.js, react-Bootstrap, cdbreact, react-Icons,  Axios

Backend - Express, Node.js, MongoDB, Mongoose, bcrypt, google-auth-library, jsonwebtoken, jwt-decode
Other - GitHub


### Brief

The project has to be a working full-stack, single-page application hosted on netlify using the MERN-stack.

It has to have a well styled interactive front-end that communicates with express backend using AJAX.

The application has to implement user authorization by restricting CUD data functionality to authenticated users.

Optionally it could consume API.

Must be presented with a smooth UI and everyone in the team must collaborate towards a data model.


### Planning

We spent the first couple of days coming up with project ideas, pitching them to our group and finally deciding on what to go for. 

![inspiration picture](../unit3project-frontend/public/assets/IMG_8900.jpg)

We chose to do a day planner which was an inspiration that came to me as I’ve had a planner for nearly 2 years now and it changed my life, unfortunately like any book it ran out of pages and I thought how nice it would be to have this in a digital format that anyone can access, especially if one is struggling with building or maintaining a routine.

We then agreed on the layout of styles and tasks each person in the team was going to lead. The application consisted of 3 main data models including a To-Do, a Daily checker and a Schedule model.

![layout of plan](../unit3project-frontend/public/assets/img2.png)
![layout of plan](../unit3project-frontend/public/assets/img3.png)

### Build/Code Process

We started by deciding on our Schemas and discussing the functional sections of the app to divide the tasks accordingly. We had 3 main CRUDable sections in our application. A To-Do List, daily checker and a Schedule keeper along with the login/logout functionality. 

I was in charge of creating the login/logout functionality and the To-Do List. I also helped Patrick with the daily checker.

Firstly, we spent day 1 familiarising ourselves with how to work as collaborators on GitHub as this was the first time either of us were working in a team. It was a learning curve trying to wrap my head around the whole push, merge, pull, .. however my midday of day 1 we felt less overwhelmed than 4 hours ago. It was not time to get started.

I started by building the login functionality for the app. To do this I implemented passport-google-oauth20 and began working the backend

//UserSchema
Step 1: Firstly, I define the user Schema.
```
const userSchema = new mongoose.Schema({
 email: {
   required: true,
   unique: true,
   type: String,
 },
 name: {
   required: true,
   type: String,
 },
})
```

//finding or creating a user
Step 2: I then created a function to find a user if that user is available else create a new user.
```
export async function findOrCreateUser(loggedInUser) {
   try {
       const now = new Date();
       const existingUser = await User.findOne({ email: loggedInUser._json.email });
       if (!existingUser) {
           const newUser = new User({
               email: loggedInUser._json.email,
               lastLogin: now,
               name: loggedInUser._json.name,
           });
           await newUser.save();
       } else {
           await User.findOneAndUpdate(
               { email: loggedInUser._json.email },
               {
                   lastLogin: now,
                   name: loggedInUser._json.name,
               },
               { new: true }
           );
       }
   } catch (e) {
       console.error(e);
   }
}
```

//routes
Step 3: I created the routes, namely login and logout that will directly let you log in from your google account.

```
router.get("/login/success", async (req, res) => {
 if (req.user) {
   console.log(req.user);
   await findOrCreateUser(req.user);
   res.status(200).json({
     error: false,
     message: "Successfully Logged In",
     user: req.user,
   });
 } else {
   res.status(403).json({ error: true, message: "Not Authorized" });
 }
});


router.get("/login/failed", (req, res) => {
 res.status(401).json({
   error: true,
   message: "Log in failure",
 });
});


router.get(
 "/google/callback",
 passport.authenticate("google", {
   successRedirect: process.env.CLIENT_URL,
   failureRedirect: "/login/failed",
   prompt: "select_account",
 })
);


router.get("/google", passport.authenticate("google", ["profile", "email"]));


router.get("/logout", (req, res) => {
 req.logout(() => {});
 res.redirect(process.env.CLIENT_URL);
});
```

// strategy
Step 4: set the strategy.
```
passport.use(
 new GoogleStrategy(
   {
     clientID: process.env.CLIENT_ID,
     clientSecret: process.env.CLIENT_SECRET,
     callbackURL: "/auth/google/callback",
     scope: ["profile", "email"],
   },
   async function (accessToken, refreshToken, profile, callback) {
     callback(null, profile);
   }
 )
);


passport.serializeUser((user, done) => {
 done(null, user);
});


passport.deserializeUser((user, done) => {
 done(null, user);
});
```

— In The Frontend —

// user functions
Step 5: I then fetched the user. If a user is found/created I made it so the application redirects to the homepage and finally I set the JSX.

```
 const googleAuth = useCallback(() => {
   const result = window.open(
     `${process.env.REACT_APP_AUTH_URL}/auth/google/callback`,
     "_self",   
     );
     console.log(result)
 }, []);


 const getUser = async () => {
   try {
     const url = `${process.env.REACT_APP_AUTH_URL}/auth/login/success`;
     const { data } = await axios.get(url, { withCredentials: true });
     console.log(data.user._json);
     setUser(data.user._json);
   } catch (e) {
     console.error(e);
   }
 }


 const handleLogout = async () => {
   window.open(`${process.env.REACT_APP_AUTH_URL}/auth/logout`, "_self");
 };
 ```

Now for the To-Do List build.

Step 1: As Always I started with defining my Schema that consisted of 2 main values namely, the actual to-do and whether completed or not. A user is also only allowed to add a to-do if they’re logged in and can only see their own list of to-dos. After adding the checklist for the day it is displayed on the home page, at the end of each day the information is moved to a separate page that allows the user to view all completed and incomplete to-dos hence clearing the home page creating a clean slate for the next day.

```
const toDoSchema = new mongoose.Schema({
   todo: String,
   completed: Boolean,
   userId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
   },
   date: {
       type: Date,
       default: Date.now
   }
}, { timestamps: true });
```

// post and delete routes
Step 2: I then created all my necessary routes including get and update route.

```
app.post("/todos/add", async (req, res) => {
 console.log(req.header);
 try {
   const userEmail = req.header("user-email");
   const user = await User.findOne({ email: userEmail });
   if (user) {
     const todo = req.body;
     // console.log(req.body);
     const newTodo = new ToDo({
       todo: todo.todo,
       completed: todo.completed,
       userId: user._id,
       date: todo.date,
     });
     await newTodo.save();
     console.log(newTodo);
     res.sendStatus(200);
   } else {
     console.log("Not found");
     res.status(500).json({ message: "User not found" });
   }
 } catch (e) {
   console.error(e);
   res.status(500).json({ message: "Internal server error" });
 }
});


app.delete("/todos/:id", async (req, res) => {
 try {
   await ToDo.deleteOne({ _id: req.params.id });
   console.log("todo deleted----------");
   res.sendStatus(200);
 } catch (e) {
   console.error(e);
 }
});
```

— In The Frontend —

// fetching to-dos
Step 3: I then fetched the to-dos in the frontend and also created functions to be able to add, update and delete a to-do. Finally I displayed the list according to the date posted

```
 const fetchData = useCallback(async () => {
   try {
     const response = await axios.get(
       `${process.env.REACT_APP_BACKEND_URL}/todos`,
       {
         headers: {
           "user-email": user.email,
           "Content-Type": "application/json",
         },
       }
     );
     const result = response.data;
     setTodos(result);
   } catch (e) {
     console.error(e);
   }
 }, [user]);


 function handleCheckboxChange(id) {
   const updatedTodos = [...todos]
   const todo = updatedTodos.find(t => t._id === id)
   todo.completed = !todo.completed
   setTodos(updatedTodos)
   updateTodoOnServer(todo)
   console.log(todo)
 }


 function handleInputChange(id, newValue) {
   const updatedTodos = [...todos]
   const todo = updatedTodos.find(t => t._id === id)
   todo.todo = newValue
   setTodos(updatedTodos)
   updateTodoOnServer(todo)
   console.log(todo)
 }


 async function updateTodoOnServer(updatedTodo) {
   try {
     await axios.put(
       `${process.env.REACT_APP_BACKEND_URL}/todos/${updatedTodo._id}`,
       updatedTodo,
       {
         Headers: {
           "Content-Type": "application/json",
         },
       }
     );
     await fetchData();
   } catch (e) {
     console.error(e);
   }
 }
```

### Challenges

It was a challenge learning how to use GitHub without collaborators let alone with collaborators. For this project we were pretty much thrown in the deep end to learn and figure out how to use GitHub without the fear of deleting 5 days worth of code. Time was not our friend during this project as we sometimes spent hours trying to solve conflicts on merge hence giving us not a lot time to code, we also had one teammate down due to family emergency so the pressure was real. Although I can definitely say, after one busy week of discomfort I am glad to be put in that position as I feel a lot more confident with GitHub and that uncomfortable situation is what helped me learn and grasp the most.


### Wins

Delving deeper into Express.js and mastering its file and folder system, alongside the implementation of React for designing Single Page Applications, stands out as my greatest triumph in coding Journée, solidifying a significant ‘lightbulb’ moment in my journey.


### Key Learnings/Takeaways

This was my first time using React and I am in Love, I don’t know if it is common for a developer to find their favourite technology this early on in their dev journey but I think I have found mine. I enjoyed how seamless and almost effortless React is, something I am going to be using a lot more. On completion of this project, I also felt a lot more comfortable using Node.js and Express.js as this was the second time I worked with the two.

At this point I am also proud of how I managed this group project. It has helped me gain a better understanding of developing, deploying, teamwork, GitHub and it also boosted my confidence overall.


### Future Improvements

I would like to continue working on the UI and aim to make this app mobile friendly.

### Backend Git Repo link

https://github.com/EvylinaAn/unit3project-backend