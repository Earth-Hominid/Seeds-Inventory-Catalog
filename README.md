# Seeds | Inventory Management System

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Pug](https://img.shields.io/badge/Pug-FFF?style=for-the-badge&logo=pug&logoColor=A86454)

An inventory management application for an online seed store.

Click here for the [live demo](seeds-inventory-catalog-production.up.railway.app).

<img width="944" alt="home" src="https://user-images.githubusercontent.com/66766688/167498047-e690028f-9bbc-4758-8e93-e2d970273f25.png">

## Description

The purpose of this project is to practice using the ExpressJS framework to build a RESTful api that communicates with a MongoDB database. The PUG templating language was utilized for the front-end.

The application provides inventory control software for a seed company. The Seed Department is segregated into categories and sub-catgories which contain different products.

Departments, categories, sub-categories and products can be created, added, deleted and updated.

<img width="945" alt="add-prod" src="https://user-images.githubusercontent.com/66766688/167498110-0f87c60f-8a62-4616-9fd2-b4d4e605505d.png">

MongoDB was chosen due to it's ease of of use and fast time to productivity. In order to communicate with the database, Mongoose (an ODM library for MongoDB) was chosen for its simplicity and fast learning curve.

This project is a simple application to assist in learning the ExpressJS framework. As it is not customer facing software, efficiency and performance were sacrificed by electing to use Mongoose, rather tahn MongoDB's direct query language (MQL).

As Mongoose is a 3rd party vendor, if this were a professional application I would research MongoDB's native drivers and elect to utilize them over Mongoose.

The Tailwind library was used for css styling, and the UI theme is based on the popular app Discord.

## Features

- Follows the MVC (Model, View, Controller) design pattern.
- Modular structure for route handling code.
- Clean UI

## Epiphanies | Resolved Issues

- Models are objects, we use Object Oriented Programming to create each new entry into the database.

- In order to grab the name of the cateory object, [0] needs to be added. Thus, to show in PUG, "category[0].name" needs to be used.

```js
ul
    each product in product_list
      li
        a(href=product.url) #{product.name}
        |  (#{product.category[0].name})
```

- CSS was rendering for the homepage only. Chrome dev tools showed a MIME type error in the console. To resolve the bug, an extra '.' was required in the stylesheet link. This solved the issue for routes that were one deep, such as '/catalog/departments'.

However, the error still occured on routes that went two deep, such as '/catalog/categories/herbs'. Thus, an additional '../' needs to be added for each level added to the url.

```js
link(href="../../styles/style.css",
```

- An issue occured with textarea not displaying text which was retrieved back from MongoDB in order to update the description textarea input. The problem occured because textarea does not use text found within it's value (like text input does), instead it uses text found within its body. Thus,

```js
textarea((value = undefined === product ? '' : product.description));
```

needed to be changed to:

```js
textarea = undefined === product ? '' : product.description;
```

### Dependencies

- [Express](https://expressjs.com/)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Nodemon](https://nodemon.io/) - Development dependency
- [Mongoose](https://mongoosejs.com/)
- [Colors](https://www.npmjs.com/package/colors) - Colored text for the console.
- [Multer](https://github.com/expressjs/multer) Middleware for uploading files
- [Express-Validator](https://express-validator.github.io/docs/#basic-guide)
- [ValidatorJS](https://github.com/validatorjs/validator.js)
- [Compression](https://www.npmjs.com/package/compression)
- [Helmut](https://helmetjs.github.io/)
