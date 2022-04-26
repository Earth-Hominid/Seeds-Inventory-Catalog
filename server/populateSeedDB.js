console.log('This script populates some data.');
// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

const async = require('async');
const Department = require('./models/department');
const Category = require('./models/category');
const Subcategory = require('./models/subcategory');
const Product = require('./models/product');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const departments = [];
const categories = [];
const subcategories = [];
const products = [];

const createDepartment = (title, description, cb) => {
  departmentDetail = { title: title, description: description };

  const department = new Department(departmentDetail);

  department.save(function (err) {
    if (err) {
      console.log('Error creating department ' + department);
      cb(err, null);
      return;
    }
    console.log('New Department: ' + department);
    departments.push(department);
    cb(null, department);
  });
};

const createCategory = (name, department, description, cb) => {
  categoryDetail = {
    name: name,
    department: department,
    description: description,
  };

  const category = new Category(categoryDetail);

  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
};

const createSubcategory = (name, department, category, description, cb) => {
  subcategoryDetail = {
    name: name,
    department: department,
    category: category,
    description: description,
  };

  const subcategory = new Subcategory(subcategoryDetail);

  subcategory.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Subcategory: ' + subcategory);
    subcategories.push(subcategory);
    cb(null, subcategory);
  });
};

const createProduct = (
  name,
  stockNumber,
  description,
  price,
  packageSize,
  seedsPerGram,
  quantity,
  department,
  category,
  subcategory,
  cb
) => {
  productDetail = {
    name: name,
    stockNumber: stockNumber,
    description: description,
    price: price,
    packageSize: packageSize,
    seedsPerGram: seedsPerGram,
    quantity: quantity,
    department: department,
    category: category,
    subcategory: subcategory,
  };

  const product = new Product(productDetail);

  product.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Product: ' + product);
    products.push(product);
    cb(null, product);
  });
};

function createDepartments(cb) {
  async.parallel(
    [
      function (callback) {
        createDepartment(
          'Seeds',
          'Organic gardening entails growing food without the use of genetic engineering, synthetic fertilizers, toxic pesticides or drugs. Eating organically grown food can eliminate exposure to dangerous insecticides and studies show that organically grown products have higher levels of minerals and nutrients. Our seeds are organically grown from open pollinated plants,  including heirlooms. This means they will almost always grow true to seed if another variety does not cross-pollinate them.',
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

function createCategories(cb) {
  async.parallel(
    [
      function (callback) {
        createCategory(
          'Vegetables',
          departments[0],
          'Growing vegetables at home helps to reduce our carbon impact. Every lettuce we eat that has not travelled by truck or airplane, contributes to our personal reduction. Organic growing is all about sustainability, and leaving the soil healthy and productive, even after the harvest. Thoughtful use of water and other resources is part of the organic mindset. Motivated by the sustainable production of food at the local level, we can eat healthy and contribute to a healthy environment.',
          callback
        );
      },
      function (callback) {
        createCategory(
          'Flowers',
          departments[0],
          'All flowers support pollinators and beneficial insects. Understanding the growth type of each flower helps a great deal when planning a flower bed. ',
          callback
        );
      },
      function (callback) {
        createCategory(
          'Herbs',
          departments[0],
          'From the windowsill of a high-rise apartment to the country farm, herbs are easy to grow from seed, and usefull in the kitchen everyday. They can be preserved to last for many months. The majority of our herbs are open pollinated, so their seeds can be saved from year to year. Many of them are perennial, planted once, they will continue to grow year to year.',
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

function createSubcategories(cb) {
  async.parallel(
    [
      function (callback) {
        createSubcategory(
          'Kale',
          departments[0],
          categories[0],
          "Kale contains the highest levels of beta-carotene f any green vegetable. It's also high in vitamins A, C,K, and B6, along with potassium, calcium, and iron. There are three distinct 'tribes' of kale: Mediterranean kale (like Lacinato), Scottish kale (typically very curly leaves), and Russian or Siberian kale. Collards are almost identical to kale botanically. Its hardiness, flavour, and ease of growth are very similar to kale.",
          callback
        );
      },
      function (callback) {
        createSubcategory(
          'Chives',
          departments[0],
          categories[2],
          'Chives are hardy, perennial, and easy to grow. The chopped stems and pink flowers add a fresh, mild green onion flavour to sandwiches, salads, and baked potatoes. If grown in containers, divide frequently enough to provide for lateral growth.',
          callback
        );
      },
      function (callback) {
        createSubcategory(
          'Oregano',
          departments[0],
          categories[2],
          'Oregano produces some of the nicest, most pungently-flavoured leaves for cooking.',
          callback
        );
      },
      function (callback) {
        createSubcategory(
          'Bush Beans',
          departments[0],
          categories[0],
          'Bush beans are perfect for smaller gardens, and the pod set is relatively concentrated. They fix nitrogen into the soil. After harvesting, you can plant nitrogen-hungry spinach and lettuce in the same plot.',
          callback
        );
      },
      function (callback) {
        createSubcategory(
          'Basil',
          departments[0],
          categories[2],
          'Basil is the best in the height of summer. It is very easy to grow, even in containers. Basil does not dry as well as other herbs, as it tends to lose its flavour. However, leaves that are cut in strips and frozen in water in ice cube trays stay nearly as aromatic as if freshly picked. ',
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

function createProducts(cb) {
  async.parallel(
    [
      function (callback) {
        createProduct(
          "Lion's Mane",
          'HR1071',
          "A. tuberosum. This broadleaf variety of garlic chives has quit flat, flavourful leaves reminiscent of a lion's mane. This fast growing variety has a fine flavour and edible white flowers. Plant garlic chives to repel pest insects.",
          4.59,
          '0.5g',
          '250 s/g',
          1,
          departments[0],
          categories[2],
          subcategories[1],
          callback
        );
      },
      function (callback) {
        createProduct(
          "Oregano Za'atar",
          'HR1183',
          'O. syriacum. This Mediterranean native is named for the spice mix that is common in its homeland. This wild oregano has hints of thyme and marjoram mixed in for a complex but appealing fragrance. It is low growing and compact at about 20cm tall. Grow it as an annual - as a perennial, it is hardy in Zones 9-10 only.',
          3.39,
          '50 seeds',
          '9850 s/g',
          1,
          departments[0],
          categories[2],
          subcategories[2],
          callback
        );
      },
      function (callback) {
        createProduct(
          "Jacob's Cattle Bean",
          'BN205',
          'OP, 67 days. The plump, oblong beans are creamy white, and speckled with deep burgundy. The markings darken to almost coffee brown as the seeds age. During the summer it produces quite nice snap beans, before the seeds mature. By the end of the season, the prolific bush plants produce masses of pods that are easy and fun to harvest.',
          4.99,
          '15g, ~20 seeds',
          '2.3 s/g',
          1,
          departments[0],
          categories[0],
          subcategories[3],
          callback
        );
      },
      function (callback) {
        createProduct(
          'Dolce Fresca',
          'HR1189',
          'Sweet and fresh, this picturesque basil won the AAS award for both flavour and form. After harvest, it rebounds to its previous tidy shape. The large leaves of Dolce Fresca are among the nicest Genovese basils we’ve tried. It looks fantastic in patio containers, or just growing in any well drained herb bed. Grow this basil in full sun during the warmest part of the year. Harvest regularly by pinching top-most pair of leaves from each stem. This will encourage bushy, vigorous growth lower on the plants and prolong the harvest window for each plant.',
          3.99,
          '200 seeds',
          '',
          1,
          departments[0],
          categories[2],
          subcategories[4],
          callback
        );
      },
      function (callback) {
        createProduct(
          'Scarlet Kale',
          'KL444',
          'OP, 60 days. Scarlet kale grows tall with highly curled, deep purple leaves. It has a great flavour as baby leaf or mature kale, and the colour improves with cool temperatures. This attractive, nutrient rich variety was bred in the UK.',
          3.19,
          '25 seeds',
          '',
          1,
          departments[0],
          categories[0],
          subcategories[0],
          callback
        );
      },
      function (callback) {
        createProduct(
          'Rainbow Lacinato',
          'KL428',
          'A fabulous cross of beloved Lacinato with the super cold hardy Redbor produces these multicoloured plants with mostly the strap-like leaves of the Lacinato and the colouring of the Redbor.',
          3.79,
          '0.25g, ~76 seeds',
          '',
          1,
          departments[0],
          categories[0],
          subcategories[0],
          callback
        );
      },
      function (callback) {
        createProduct(
          'Red Russian',
          'KL438',
          'Red Russian Organic Kale Seeds grow leaves that are flat, toothed, grey-green leaves with bright purple stems and veins really brighten and sweeten after frosts. Tender for salads and good for bunching, the red and purple hues turn a rich, dark green colour when cooked.',
          3.79,
          '1g, ~350 seeds',
          '350 s/g',
          1,
          departments[0],
          categories[0],
          subcategories[0],
          callback
        );
      },
      function (callback) {
        createProduct(
          'Winter Red',
          'KL432',
          'A Red Russian type kale developed for good uniform colour and old hardiness. Winter Red is a tender salad kale that works well in a crop scheme with others for a continuous, year-round harvest. The edible flower buds (known as napini) from this cultivar arrive early, and are dark red, slim, and tasty. Winter Red makes excellent microgreens, baby salad greens, and mature leafy kale.',
          5.99,
          '5g, ~1403 seeds',
          '260 s/g',
          1,
          departments[0],
          categories[0],
          subcategories[0],
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createDepartments, createCategories, createSubcategories, createProducts],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('Products: ' + products);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
