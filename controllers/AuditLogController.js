const db = require('../models/auditlog.model');
const AuditLog = db.AuditLog;

class AuditLogController {
  async listAll(req, res) {
    try {
      const logs = await AuditLog.findAll({ order: [['createdAt', 'DESC']] });
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async listByUser(req, res) {
    try {
      const { userId } = req.params;
      const logs = await AuditLog.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AuditLogController();
