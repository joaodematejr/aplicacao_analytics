const express = require('express');
const router = express.Router();

const analyticController = require('../controllers/analyticController');

router.get('/', analyticController.getAll);
router.post('/', analyticController.create);
router.get('/:id', analyticController.getById);
router.put('/:id', analyticController.updateById);
router.delete('/:id', analyticController.deleteById);

module.exports = router;
