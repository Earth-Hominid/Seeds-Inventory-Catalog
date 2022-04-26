# Seeds | Inventory Management Seed Catalog

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Pug](https://img.shields.io/badge/Pug-FFF?style=for-the-badge&logo=pug&logoColor=A86454)

An inventory management application for an online seed store.

## Description

The purpose of this project is to practice using the ExpressJS framework to build a RESTful api that communicates with a MongoDB database. The PUG templating language was utilized for the front-end.

The application provides inventory control software for a seed company. The Seed Department is segregated into categories and sub-catgories which contain different products.

Departments, categories, sub-categories and products can be created, added, deleted and updated.

MongoDB was chosen due to it's ease of of use and fast time to productivity. In order to communicate with the database, Mongoose (an ODM library for MongoDB) was chosen for its simplicity and fast learning curve.
This project is a simple application to assist in learning the ExpressJS framework. As it is not customer facing software, efficiency and performance were sacrificed by electing to use Mongoose, rather tahn MongoDB's direct query language (MQL).
As Mongoose is a 3rd party vendor, if this were a professional application I would research MongoDB's native drivers and elect to utilize them over Mongoose.

## Features

- Follows the MVC (Model, View, Controller) design pattern.
- Modular structure for route handling code.

## Epiphanies

- Models are objects, we use Object Oriented Programming to create each new entry into the database.

### Dependencies

- [Express](https://expressjs.com/)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Nodemon](https://nodemon.io/) - Development dependency
- [Mongoose](https://mongoosejs.com/)
- [Colors](https://www.npmjs.com/package/colors) - Colored text for the console.
