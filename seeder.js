const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
require('colors')

// Load env vars
dotenv.config({ path: './config/config.env' })

// Load models
const Bootcamp = require('./models/BootcampModel')
const Course = require('./models/CourseModel')
const User = require('./models/UserModel')
const Review = require('./models/ReviewModel')

// Connect to DB
mongoose.connect(encodeURI(process.env.MONGO_URI), {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Read fake JSON data
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
)
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
)
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
)
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
)

// Import data into DB
async function importData() {
  try {
    // Import bootcamps
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
    await User.create(users)
    await Review.create(reviews)

    console.log('Data Imported...'.green.inverse)

    // Exit process and close mongoose connection
    mongoose.connection.close()
    process.exit(0)
  } catch (err) {
    console.error(err)
  }
}

// Destory Datat in DB
async function destroyData() {
  try {
    // Delete all bootcamps
    await Bootcamp.deleteMany()
    await Course.deleteMany()
    await User.deleteMany()
    await Review.deleteMany()

    console.log('Data Destroyed...'.red.inverse)

    // Exit process and close mongoose connection
    mongoose.connection.close()
    process.exit(0)
  } catch (err) {
    console.error(err)
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  destroyData()
}
