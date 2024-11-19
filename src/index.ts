import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import * as createError from 'http-errors';
import { Routes } from "./routes"
import * as cors from 'cors';
import 'dotenv/config'
import {authenticate} from "./middleware/authenticate";


// cors options
const corsOptions ={
    origin: /localhost\:\d{4}$/i, // localhost any 4 digit port
    credentials: true, // needed to set and return cookies
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
    methods: 'GET,PUT,POST,DELETE',
    maxAge: 43200, // 12 hours
};

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    app.use(cors(corsOptions)); // enable CORS for all handlers
    app.use((req: express.Request, res: express.Response, next: express.NextFunction ) => {
        if (req.xhr && req.accepts('application/json')) next();
        else next(createError(406));
    });
    app.options('*', cors(corsOptions));

    Routes.forEach(route => {
        // check if route needs authentication. If it does then add authenticate middleware
        const middleware = route.needAuth ? [authenticate] : [];
                                                // add middleware here with spread operator
        (app as any)[route.method](route.route, ...middleware , (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });
// error handler
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({status: err.status, message: err.message, stack: err.stack.split(/\s{4,}/)});
    });
    // start express server
    app.listen(3000)

    console.log("Express server has started on port 3000. Open http://localhost:3000/recipe to see results")

}).catch(error => console.log(error))
