const express = require('express');
const router = express.Router();
const { handleRefreshToken } = require('../../controllers/log/refreshHandler');

router.post('/', handleRefreshToken);

module.exports = router;
