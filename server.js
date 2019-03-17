const vueRenderer = require('@doweb/vuexpress').vueRenderer;
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bird = require('./birds');
const forms = require('./form');
const mustacheExpress = require('mustache-express');
const session = require('express-session');

const app = express();
const html_dir = __dirname + '/html/';


/**
 * Experimentar o vuexpress
 */
let siga = true
let options = {
    views: './views',
    cache: true,
    // watch: false,
    metaInfo: {
        title: 'default title'
    },
    extractCSS: true,
    // cssOutputPath: 'css/sty  le.css', //Será que cria o ficheiro ou vá ser preciso cria-lo
    // punlicPath: './public',
    // globals: { example: 'global!!!' },
    // plugins: [], // para aqui vão os plugins do vue
    // compilerConfig: {} // "custom webpack config"
    // compilerConfigCallback: function (webpackConfig) { return webpackConfig } // "change the merge config if you like"
    onError: (err) => {
        siga = false
        console.log('ata2', err)
    },
    OnReady: () => {
        siga = true
        console.log('nice')
    }
}

/**
 * Até aqui
 */

app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static('./'));

app.use('/birds', bird); // Rotas relacionados com birds
app.use('/form', forms);
app.set('trust proxy', 1) // qué isto 
app.use(session({
    secret: 'tabem',
    resave: false, // qué isto
    saveUninitialized: true, // caredo qué isto
    // cookie: { secure: true }, 
    /**
     * Faz com que a session ID mude sempre,
     * deve ser por isso que depois tem que se fazer o cookieParser(secret, options),
     * ou outro, pág.213
     * Testando em browser diferentes ao "mesmo" tempo, os sessionID são diferentes
     */
}))

const renderer = vueRenderer(options);
app.use(renderer)
/**
 * Saber qual é a session cookie sempre que há uma "interação..."
 */
app.use((req, res, next) => {
    console.log(req.session, req.sessionID)
    next()
})

// app.engine('html', mustacheExpress());
// app.set('view engine', 'vue'); // Isto está a crashar o servidor (listen EADDRINUSE: address already in use :::5000)
/**
 * Afinal basta reiniciar o nodemon para dar o erro acima
 */
// app.set('views', html_dir);


app.get('/', (req, res) => {
    // res.send({ ola: "aaa" })
    console.log(renderer)
    // if (siga) res.render('um', { var1: "ila" })
    res.send(req.sessionID + " --> sessionID")
});

app.get('/destroy', (req, res) => {
    console.log(req.session)
    req.session.destroy((err) => {
        if (err) console.log("Houve um erro ao destruir a cookie")
    })
    res.send(req.session + "  oal")
})

// let port = process.env.PORT || 3000
let port = 5000;
app.listen(port, function () {
    console.log(`Servidor a escuchar en el port ${port}`)
});