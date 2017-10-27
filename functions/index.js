require('zone.js/dist/zone-node');
require('reflect-metadata');
const functions = require('firebase-functions');
const renderModuleFactory = require('@angular/platform-server').renderModuleFactory;
const enableProdMode = require('@angular/core').enableProdMode;
const join = require('path').join;
const readFileSync = require('fs').readFileSync;
const express = require('express');
const ngExpressEngine = require('@nguniversal/express-engine').ngExpressEngine;
const provideModuleMap = require('@nguniversal/module-map-ngfactory-loader').provideModuleMap;

enableProdMode();

const app = express();
const DIST_FOLDER = join(__dirname, 'dist');

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/main.bundle');

app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER));

app.get('*', (req, res) => {
    res.render('index', { req });
});

exports.ssr = functions.https.onRequest(app);