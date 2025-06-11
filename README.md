# Elite Stays

Elite Stays is a full-stack web application inspired by Airbnb that allows users to register, authenticate, and manage property listings with dynamic map integration. Built using Node.js, Express, MongoDB, and EJS, it includes image uploads, form validation, and secure authentication.

## 🌐 Live Demo _Coming Soon_
[Click to go Live](https://elite-stays.onrender.com/listings)

## 🚀 Features -

- **User Authentication**: Secure registration and login using Passport.js (LocalStrategy)
- **CRUD Listings**: Create, read, update, and delete property listings
- **Image Uploads**: Upload and manage images using Multer and Cloudinary
- **Interactive Map**: Geocode and visualize locations using Mapbox
- **Server-Side Rendering**: Fast-rendered dynamic pages using EJS templating
- **Validation & Flash Messaging**: Joi for input validation and connect-flash for user feedback
- **Robust Error Handling**: Centralized error middleware and custom error classes

## 🧰 Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (server-side rendering), Bootstrap (for styling)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy
- **File Upload**: Multer + Cloudinary
- **Validation**: Joi
- **Map Services**: Mapbox
- **Session Management**: express-session
- **Other Tools**: Method-Override, connect-flash

## 📁 Project Structure

<pre> elite-stays/ 
├── app.js # Main application file 
├── models/ # Mongoose models (User.js, Listing.js) 
├── routes/ # Route definitions (auth.js, listings.js) 
├── controllers/ # Business logic for routes 
├── middleware/ # Authentication, validation, and error middleware 
├── public/ # Static files (CSS, client-side JS) 
│ └── styles/ 
├── views/ # EJS templates (partials, layouts, pages) 
├── utils/ # Helper files (ExpressError, catchAsync, cloudinary.js) 
├── init/ # MongoDB connection logic 
├── cloudConfig.js # Cloudinary configuration 
├── .env # Environment variables 
└── package.json </pre>

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (Atlas or local)
- Cloudinary account
- Mapbox API key ### Installation

```
git clone https://github.com/shreyasKU31/elite-stays.git
cd elite-stays
npm install
```

### Environment Variables Create a `.env` file in the root directory with the following content:

```
PORT=3000
MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
MAPBOX_TOKEN=your_mapbox_access_token
```

### Running the App

`npm start`
`Visit `http://localhost:3000` in your browser.

## 🔗 Routes Overview -

**Authentication**

- `GET /register`, `POST /register`-`GET /login`, `POST /login`-`GET /logout`-

**Listings**

- `GET /listings`-`GET /listings/new`, `POST /listings`-`GET /listings/:id`-`GET /listings/:id/edit`, `PUT /listings/:id`-`DELETE /listings/:id`

## Map Integration

Mapbox is used to:

- Geocode user-entered locations
- Display listing locations on an interactive map

Elite Stays integrates **Mapbox** to enhance the user experience by visualizing listing locations on an interactive map.

### What Mapbox Does:

- **Geocoding User Locations**  
  When a user creates or updates a listing, the location input (e.g., city or address) is geocoded using the **Mapbox Geocoding API**, converting it into geographic coordinates (longitude and latitude).

- **Displaying Interactive Maps**  
  These coordinates are used to place markers on a **Mapbox map** embedded in the listing detail page. This allows users to:
  - View the exact location of a listing
  - Interact with the map (zoom, drag, etc.)
  - See listings spatially rather than just by name

### How It Works in Code:

- In the backend, the location string is passed to Mapbox's API.
- The response returns geo-coordinates which are saved to the database.
- On the frontend, Mapbox GL JS is used to render a map and display a pin based on the stored coordinates.

```js
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: listing.geometry.coordinates,
  zoom: 9,
});

new mapboxgl.Marker().setLngLat(listing.geometry.coordinates).addTo(map);
```

## Future Enhancements

- Responsive design for mobile and tablets
- Booking and payment functionality
- Search filters and map clustering
- User reviews and favorites

## License This project is open-source and available under the [MIT License](LICENSE).

Developed with dedication by [Shreyas](https://github.com/shreyasKU31)
