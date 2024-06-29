/// Twitter

/* -----> import Third Party packages <----- */
const express = require("express"); // Web Application Framework
const { open } = require("sqlite"); // database connection
const sqlite3 = require("sqlite3"); // database driver
const path = require("path"); // file path
const bcrypt = require("bcrypt"); // Encrypt the password
const jwt = require("jsonwebtoken"); // Access Token

/* -----> creating Express server Instance <----- */
const app = express();

/* -----> Database Path <----- */
// Database tables => user, follower, tweet, reply, like
const databasePath = path.join(__dirname, "./twitterClone.db");

/* -----> JSON Object Request <----- */
app.use(express.json());

/* -----> Connecting SQLite Database <----- */

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    /* -----> Assigning a port Number <----- */
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

/* -----> Handling HTTP Request <----- */
// app.METHOD(PATH, HANDLER)

// API 0
// Home
app.get("/", async (request, response) => {
  console.log("Home");
  response.send("Home");
});

// Middleware Functions

// Authenticate Token
const authenticateToken = (request, response, next) => {
  console.log("authenticateToken Middleware");
  const authHeader = request.headers;
  const { authorization } = authHeader;
  let userJwtToken;
  if (authorization !== undefined) {
    userJwtToken = authorization.split(" ")[1];
  }
  console.log(userJwtToken);

  if (userJwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(userJwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        const { username } = payload;
        const selectUserQuery = `
    SELECT 
      user_id AS userId
    FROM 
      user 
    WHERE username = "${username}";
  `;
        const selectUser = await database.get(selectUserQuery);
        const { userId } = selectUser;
        request.userId = userId;
        next();
      }
    });
  }
};

// IS Following User
const isFollowingUser = async (request, response, next) => {
  console.log("isFollowingUser Middleware");
  const { tweetId } = request.params;
  console.log(tweetId);
  const userId = request.userId;
  console.log(userId);
  const userFollowingPeopleQuery = `
  SELECT
        user.user_id AS followingUserId
  FROM 
        user INNER JOIN follower
        ON user.user_id = follower.following_user_id
  WHERE
       follower.follower_user_id = ${userId};
  `;
  const userFollowingPeople = await database.all(userFollowingPeopleQuery);

  const tweetUserIdQuery = `
    SELECT
        user_id AS tweetUserId
  FROM 
        tweet
  WHERE
       tweet_id = ${tweetId};
  `;
  const tweetUserId = await database.get(tweetUserIdQuery);

  const isFollowingUser = userFollowingPeople.some(
    (eachFollowing) => eachFollowing.followingUserId === tweetUserId.tweetUserId
  );
  console.log(isFollowingUser);
  if (!isFollowingUser) {
    console.log("Not Following");
    response.status(401);
    response.send("Invalid Request");
  } else {
    console.log("Following");
    request.tweetId = tweetId;
    next();
  }
};

// API 1
// Registration
app.post("/register/", async (request, response) => {
  console.log("Registration");
  const userDetails = request.body;
  console.log(userDetails);
  const { username, password, name, gender } = userDetails;
  const selectDbUserQuery = `
  SELECT 
       *
  FROM 
      user
  WHERE
      username = "${username}";     
  `;
  const selectDbUser = await database.get(selectDbUserQuery);
  console.log(selectDbUser);

  // Scenario 1 -> Username Already Exists
  if (selectDbUser !== undefined) {
    console.log("Username Already Exists");
    response.status(400);
    response.send("User already exists");
  } else {
    // Scenario 2 -> Password Less than 6 characters
    const passwordLength = password.length;
    if (passwordLength < 6) {
      console.log("Password Less than 6 characters");
      response.status(400);
      response.send("Password is too short");
    }
    // Scenario 3-> Successful Registration
    else {
      console.log("Successful Registration");
      const hashedPassword = await bcrypt.hash(password, 10);
      const createUserQuery = `
      INSERT INTO
            user (name, username, password, gender)
      VALUES (
          "${name}",
          "${username}",
          "${hashedPassword}",
          "${gender}"
      );      
      `;
      await database.run(createUserQuery);
      response.status(200);
      response.send("User created successfully");
    }
  }
});

// API 2
// Login
app.post("/login/", async (request, response) => {
  console.log("Login");
  const userDetails = request.body;
  console.log(userDetails);
  const { username, password } = userDetails;
  const selectDbUserQuery = `
  SELECT
       *
  FROM 
      user
  WHERE
      username = "${username}";    
  `;
  const selectDbUser = await database.get(selectDbUserQuery);
  console.log(selectDbUser);
  // Scenario 1 -> Invalid User
  if (selectDbUser === undefined) {
    console.log("Invalid User");
    response.status(400);
    response.send("Invalid user");
  } else {
    console.log("Valid User");

    const selectDbUserPassword = selectDbUser.password;
    const isPasswordMatched = await bcrypt.compare(
      password,
      selectDbUserPassword
    );
    console.log(isPasswordMatched);
    // Scenario 2 -> Incorrect Password
    if (!isPasswordMatched) {
      console.log("Incorrect PAssword");
      response.status(400);
      response.send("Invalid password");
    }
    // Scenario 3 -> Correct Password
    else {
      console.log("Correct Password");

      const payload = {
        username: username,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      console.log({ jwtToken });
      response.send({ jwtToken });
    }
  }
});

// API 3
// Latest Tweets
app.get("/user/tweets/feed/", authenticateToken, async (request, response) => {
  console.log("Latest Tweets");
  const userId = request.userId;
  console.log(userId);
  const latestTweetsQuery = `
    SELECT
      user.username,
      tweet.tweet,
      tweet.date_time AS dateTime
    FROM
      user INNER JOIN follower 
            ON user.user_id = follower.following_user_id
      INNER JOIN tweet 
            ON follower.following_user_id = tweet.user_id
    WHERE
      follower.follower_user_id = ${userId}
    ORDER BY tweet.date_time DESC
    LIMIT 4
    OFFSET 0;
  `;

  const latestTweets = await database.all(latestTweetsQuery);
  response.send(latestTweets);
});

// API 4
// User Following People
app.get("/user/following/", authenticateToken, async (request, response) => {
  console.log("User Following People");
  const userId = request.userId;
  console.log(userId);

  const userFollowingPeopleQuery = `
  SELECT
        user.name
  FROM 
        user INNER JOIN follower
            ON user.user_id = follower.following_user_id
  WHERE
       follower.follower_user_id = ${userId};
  `;

  const userFollowingPeople = await database.all(userFollowingPeopleQuery);
  response.send(userFollowingPeople);
});

// API 5
// User Followers
app.get("/user/followers/", authenticateToken, async (request, response) => {
  console.log("User Followers");
  const userId = request.userId;
  console.log(userId);
  const userFollowersQuery = `
  SELECT
        user.name
  FROM 
        user INNER JOIN follower
           ON user.user_id = follower.follower_user_id
   WHERE
        follower.following_user_id = ${userId};
  `;
  const userFollowers = await database.all(userFollowersQuery);
  response.send(userFollowers);
});

// API 6
// Get SIngle Tweet
app.get(
  "/tweets/:tweetId/",
  authenticateToken,
  isFollowingUser,
  async (request, response) => {
    console.log("Get Single Tweet");
    const tweetId = request.tweetId;
    const tweetRequestQuery = `
    SELECT
        tweet.tweet, 
        COUNT(DISTINCT like.like_id) AS likes,
        COUNT(DISTINCT reply.reply_id) AS replies,
        tweet.date_time AS dateTime
    FROM 
       tweet INNER JOIN reply
            ON tweet.tweet_id = reply.tweet_id
       INNER JOIN like
            ON tweet.tweet_id = like.tweet_id
    WHERE 
        tweet.tweet_id = ${tweetId}; 
    `;
    const tweetRequest = await database.get(tweetRequestQuery);
    response.send(tweetRequest); // tweet, likes, replies, dateTime
  }
);

// API 7
// Get Tweet Liked Users
app.get(
  "/tweets/:tweetId/likes/",
  authenticateToken,
  isFollowingUser,
  async (request, response) => {
    console.log("Get Tweet Liked Users");
    const tweetId = request.tweetId;
    const tweetLikedUsersQuery = `
    SELECT
        DISTINCT user.username
    FROM 
       user INNER JOIN like
            ON user.user_id = like.user_id
    WHERE 
        like.tweet_id = ${tweetId}; 
    `;
    const tweetLikedUsers = await database.all(tweetLikedUsersQuery);
    const tweetLikedUsersList = tweetLikedUsers.map(
      (eachUser) => eachUser.username
    );
    response.send({ likes: tweetLikedUsersList });
  }
);

// API 8
// Get Tweet Replies
app.get(
  "/tweets/:tweetId/replies/",
  authenticateToken,
  isFollowingUser,
  async (request, response) => {
    console.log("Get Tweet Replies");
    const tweetId = request.tweetId;
    const tweetRepliesQuery = `
    SELECT
       user.name, reply.reply
    FROM 
        tweet INNER JOIN reply
            ON tweet.tweet_id  = reply.tweet_id
        INNER JOIN user
            ON reply.user_id = user.user_id    
    WHERE 
        tweet.tweet_id = ${tweetId};    
    `;
    const tweetReplies = await database.all(tweetRepliesQuery);
    response.send({ replies: tweetReplies });
  }
);

// API 9
// Get User All Tweet
app.get("/user/tweets/", authenticateToken, async (request, response) => {
  console.log("Get User All Tweets");
  const userId = request.userId;
  console.log(userId);
  const getUserAllTweetsQuery = `
  SELECT
        tweet.tweet, 
        COUNT(DISTINCT like.like_id) AS likes ,
        COUNT(DISTINCT reply.reply_id) AS replies,
        tweet.date_time AS dateTime
   FROM 
        tweet LEFT JOIN like
            ON tweet.tweet_id = like.tweet_id
        LEFT JOIN reply
            ON tweet.tweet_id = reply.tweet_id    
    WHERE
        tweet.user_id = ${userId}
    GROUP BY
        tweet.tweet_id    ;
  `;
  const getUserAllTweets = await database.all(getUserAllTweetsQuery);
  response.send(getUserAllTweets);
});

// API 10
// Create Tweet
app.post("/user/tweets/", authenticateToken, async (request, response) => {
  console.log("Create a Tweet");
  const tweetDetails = request.body;
  console.log(tweetDetails);
  const { tweet } = tweetDetails;
  const userId = request.userId;
  const dateTime = new Date();
  const createTweetQuery = `
  INSERT INTO
        tweet (tweet, user_id, date_time)
  VALUES (
      "${tweet}",
       ${userId},
      "${dateTime}"
  );      
  `;
  console.log(dateTime);
  await database.run(createTweetQuery);
  response.send("Created a Tweet");
});

// API 11
// Delete Single Tweet
app.delete(
  "/tweets/:tweetId/",
  authenticateToken,
  async (request, response) => {
    console.log("Delete Single Tweet");
    const userId = request.userId;
    const { tweetId } = request.params;
    const userTweetsQuery = `
    SELECT
        *
    FROM
        tweet
    WHERE 
        user_id = ${userId} AND tweet_id = ${tweetId};
    `;
    const userTweets = await database.get(userTweetsQuery);
    console.log(userTweets);
    // Scenario 1 -> Delete Tweet of others
    if (userTweets === undefined) {
      console.log("Other Tweet");
      response.status(401);
      response.send("Invalid Request");
    }
    // Scenario -> User Delete his Own Tweet
    else {
      console.log("Own Tweet");
      const tweetDeleteQuery = `
      DELETE FROM
            tweet
      WHERE
           tweet_id = ${tweetId};      
      `;
      await database.run(tweetDeleteQuery);
      response.send("Tweet Removed");
    }
  }
);

/* -----> Default Exporting <----- */
module.exports = app;
