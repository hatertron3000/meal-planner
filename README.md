# Meal Planner App

This is an app to help my family plan meals and discover new recipes. It uses Next.js, MongoDB, and the [Edamam](https://developer.edamam.com/) recipes API.

## Prerequisites

- Node 12+
- MongoDB
- Edamam developer app key and app id

### MongoDB

This app was built using the example MongoDB/Next.js starter [described by MongoDB here](https://www.mongodb.com/developer/how-to/nextjs-with-mongodb/). As suggested by that article, I used a free managed MongoDB Atlas cluster. You could use another service or host your own DB. This app needs a connection url with a username and password and assumes a collection named "meal-plans" exists in your DB.

## Configuration

### Set up a MongoDB database

Set up a MongoDB database either locally or with [MongoDB Atlas for free](https://mongodb.com/atlas).

### Generate Edamam API Keys

Edamam's Recipe Search API lets you integrate 2.3+ million recipes and faceted recipe search into your websites or mobile applications. You can sign up for access to the Recipe Search API at [https://developer.edamam.com/edamam-recipe-api](https://developer.edamam.com/edamam-recipe-api)

For more information, see the [Edamam FAQ](https://developer.edamam.com/api/faq)

### Set up environment variables

Copy the `env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Set each variable on `.env.local`:

- `MONGODB_URI` - Your MongoDB connection string. If you are using [MongoDB Atlas](https://mongodb.com/atlas) you can find this by clicking the "Connect" button for your cluster.

- `EDAMAM_APP_ID` - Your Edamam app ID

- `EDAMAM_APP_KEY` - Your Edamam app key

### Run Next.js in development mode

```bash
npm install
npm run dev

# or

yarn install
yarn dev
```

Your app should be up and running on [http://localhost:3000](http://localhost:3000)!

You will either see a calendar or an error message. If you see an error message, ensure that you have provided the correct `MONGODB_URI` environment variable.

When you are successfully connected, you can refer to the [MongoDB Node.js Driver docs](https://mongodb.github.io/node-mongodb-native/3.4/tutorials/collections/) for further instructions on how to query your database.

## Deploy on Vercel

You can deploy this app to the cloud with [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

#### Deploy Your Local Project

To deploy your local project to Vercel, push it to GitHub/GitLab/Bitbucket and [import to Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example).

**Important**: When you import your project on Vercel, make sure to click on **Environment Variables** and set them to match your `.env.local` file.
