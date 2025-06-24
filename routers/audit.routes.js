const express = require('express');
const router = express.Router();
const AuditLogController = require('../controllers/AuditLogController');

router.get('/audit-logs', AuditLogController.listAll);
router.get('/audit-logs/user/:userId', AuditLogController.listByUser);

module.exports = router;
