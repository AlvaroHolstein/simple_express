const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()

// console.log(router)

let html_dir = __dirname + '/html/'
const css_dir = __dirname + '/css/';

router.use(express.static(html_dir))
// router.use('/', express.static(css_dir))


let birds = [
    { "papagaio": 2 },
    { "parrot": 2 },
    { "cacarot": 3 }
]
router.get('/', (req, res) => {
    res.render('index.html', { title: JSON.stringify(birds) })
})

module.exports = router;