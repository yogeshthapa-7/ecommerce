const express = require('express');
const router = express.Router();
const {
    getAuditLogs,
    getStats,
    getByEntity
} = require('../controllers/auditController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');

router.get('/', auth, adminAuth, getAuditLogs);
router.get('/stats', auth, adminAuth, getStats);
router.get('/entity/:entityType/:entityId', auth, adminAuth, getByEntity);

module.exports = router;
