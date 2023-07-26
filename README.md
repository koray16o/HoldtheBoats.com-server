# Holdtheboats.com

## Description

Holdtheboats.com is a web application that allows users to explore a wide range of boats available for sale. Users can also create accounts to publish their boat ads, add boats to their favorites, and manage their profile information.

### User Stories

1. 404: As a user I get to see a 404 page with a feedback message if I try to reach a page that does not exist so that I know it's my fault.
2. Signup: As an anonymous user I won´t be able to enter the app. I can sign up on the platform to create a profile and navigate.
3. Login: As a user I can login to the platform so that I can access my profile and start seeing boats ads or creating them.
4. Logout: As a logged in user I can logout from the platform so no one else can use it.
5. Profile Page: As a logged in user I can visit my profile page so that I can change my details and see the list of boats created.
6. Add Boats: As a logged in user I can access the add boats page so that I can create a new boat.
7. Edit Boats: As a logged in user I can access the edit boat page so that I can edit the boat I created.
8. FAQ page: As a logged in user I can access the FAQ page and read it so that I can get information if I have any doubts.

## Routes

### Frontend Routes

| Path              | Component       | Description                       |
| ----------------- | --------------- | --------------------------------- |
| /                 | Home            | Home Page                         |
| /signup           | Signup          | Signup                            |
| /forgot-password  | ForgotPassword  | Ask for a recovery password email |
| /reset-password   | ResetPassword   | Resets the password               |
| /login            | Login           | Login                             |
| /boats            | Boats           | See all boats                     |
| /search           | Search          | Search for the specified boat     |
| /boats/ads        | MyBoatAds       | See boats created by user         |
| /boats/favourites | FavBoats        | See users favourite boats         |
| /faq              | Faq             | Frequently Asked Questions        |
| /newboat          | AddBoat         | Create a new boat                 |
| /boats/edit/:id   | EditBoat        | Edit boat created by the user     |
| /boats/:id        | BoatDetails     | See boat details                  |
| /profile/:id      | UserProfile     | See the user profile              |
| /profile/edit/:id | EditUserProfile | Edit the user profile             |

### Backend Routes

| Method | Route                        | Description                 |
| ------ | ---------------------------- | --------------------------- |
| GET    | /boats                       | Gets all boats              |
| POST   | /newboat                     | Create a new boat           |
| GET    | /boats/:id                   | Gets specified boat         |
| PUT    | /boats/:id                   | Edit specified boat         |
| DELETE | /boats/:id                   | Deletes specified boat      |
| POST   | /upload                      | Uploads files               |
| POST   | /search                      | searches for specified boat |
| GET    | /boats/favourites            | Gets favourite boats        |
| POST   | /boats/:id/favourites        | Add new favourite boat      |
| DELETE | /boats/favourites/delete/:id | Deletes favourite boat      |

### Auth Routes

| Method | Route       | Description        |
| ------ | ----------- | ------------------ |
| POST   | /api/signup | Creates a new user |
| POST   | /api/login  | Logs the user      |
| GET    | /api/verify | Verifies the JWT   |

## Models

### Boat Model

```js
{
    title: {
      type: String,
      required: true
    },

    imgURL: [
      {
        type: String,
        required: true
      }
    ],

    type: {
      type: String,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    year: String,
    condition: String,
    length: String,
    beam: String,
    draught: String,
    displacement: String,
    material: String,
    steering: String,
    keel: String,
    ballast: String,
    headroom: String,
    cabins: String,
    berths: String,
    watertank: String,
    propulsion: String,
    engine: String,
    fuelType: String,

    description: {
      type: String,
      required: true
    },

    country: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
```

### User Model

```js
{
    title: String,
    description: String,
    project: [{type: Schema.Type.ObjectId, ref: "project"}]
}
```

### User Model

```js
{
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    img: {
      type: String
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    isCompany: {
      type: Boolean,
      default: false
    },
    favouriteBoats: [{ type: Schema.Types.ObjectId, ref: 'Boat' }],
    resetToken: String,
    resetTokenExpiration: String
  },
  {
    timestamps: true
  }
```

## Links

### Git

#### The url to your repository and to your deployed project

[Client repository link](https://github.com/koray16o/HoldtheBoats.com-client)

[Server repository link](https://github.com/koray16o/HoldtheBoats.com-server)

[Deployed app link](https://holdtheboats.netlify.app/login)

## Contributors

### Koray Ojeda
