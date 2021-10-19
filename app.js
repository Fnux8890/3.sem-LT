const express = require('express')
const app = express()
const connectDB = require('./app/db/connect')
const path = require('path')
const fs = require('fs')
const insertNavbar = require('./app/controller/middleware/insertNavbar')
// require files
const userRoutes = require('./app/controller/routes/users')
const pageRoutes = require('./app/controller/routes/pages')
// port
const port = 3000

//Load view enigne
app.set('views', path.join(__dirname, 'app', 'views', 'pages'))
app.set('view engine', 'pug')

//middleware
app.use(express.static(path.join(__dirname, 'app', 'views')))
app.use(express.json()) //Kan se JSON payloads fra front-end
app.use(express.urlencoded({ extended: false })) //Kan se String/text payloads fra front-end
app.use('/page/*', insertNavbar)

//routes
app.use('/api/v1/users', userRoutes)
app.use('/page', pageRoutes)

//error handler
app.use((err, req, res, next) => {
	console.log(err.message)
	res.status(err.status || 500)

	res.render('error', {
		errorCode: err.status,
		errorMessage: err.message,
	})
})

//server setup
const start = () => {
	try {
		//TODO man burde ikke connecte til databasen med det samme
		connectDB()
		app.listen(
			port,
			console.log(`server listening at: http://localhost:${port}`)
		)
	} catch (error) {
		console.log(error.message)
	}
}
start()
