const express = require('express');
const router = express.Router();
const { getBlocks, createBlock, updateBlock, deleteBlock } = require('../controllers/scheduleController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getBlocks)
    .post(createBlock);

router.route('/:id')
    .put(updateBlock)
    .delete(deleteBlock);

module.exports = router;
