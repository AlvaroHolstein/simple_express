const express = require('express')
const router = express.Router()

let html_dir = __dirname + '/html/'
router.use('/', express.static(html_dir))

module.exports = router;