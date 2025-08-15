const { KYC, User } = require("../models");

class KycController {

  createKYC = async (req, res) => {
    try {
      const userId = req.user?.id || req.body.userId;
      if (!userId) return res.status(400).json({ message: "User ID manquant" });

      const existingKYC = await KYC.findOne({ where: { userId } });
      if (existingKYC) return res.status(400).json({ message: "Un KYC existe déjà" });

      const {
        firstName, lastName, dateOfBirth, nationality, phoneNumber, address,
        city, postalCode, occupation, monthlyIncome,
        documentType, documentNumber, expiryDate, issuingCountry,
        documentFrontUrl, documentBackUrl,
        selfieUrl, livenessCheck, faceMatch
      } = req.body;

      const kyc = await KYC.create({
        userId,
        firstName, lastName, dateOfBirth, nationality, phoneNumber, address,
        city, postalCode, occupation, monthlyIncome,
        documentType, documentNumber, expiryDate, issuingCountry,
        documentFrontUrl, documentBackUrl,
        selfieUrl, livenessCheck, faceMatch,
        status: "not_started"
      });

      res.status(201).json(kyc);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la création du KYC" });
    }
  };

  getUserKYC = async (req, res) => {
    try {
      const userId = req.user?.id || req.params.userId;
      const kyc = await KYC.findOne({
        where: { userId },
        include: [{ model: User, attributes: ["id", "firstName", "lastName", "email"] }]
      });
      if (!kyc) return res.status(404).json({ message: "KYC non trouvé" });
      res.json(kyc);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la récupération du KYC" });
    }
  };

  getKYCByUserId = async (req, res) => {
    try {
      const kyc = await KYC.findOne({
        where: { userId: req.params.userId },
        include: [{ model: User, attributes: ["id", "firstName", "lastName", "email"] }]
      });
      if (!kyc) return res.status(404).json({ message: "KYC non trouvé" });
      res.json(kyc);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la récupération du KYC" });
    }
  };

  updateKYCStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, rejectionReason } = req.body;
      const adminId = req.user?.id || null;

      const kyc = await KYC.findByPk(id);
      if (!kyc) return res.status(404).json({ message: "KYC non trouvé" });

      kyc.status = status;
      kyc.rejectionReason = status === "rejected" ? rejectionReason : null;
      kyc.reviewedAt = new Date();
      kyc.reviewedBy = adminId;

      await kyc.save();
      res.json({ message: "Statut KYC mis à jour", kyc });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du statut KYC" });
    }
  };

  getAllKYCs = async (req, res) => {
    try {
      const kycs = await KYC.findAll({
        include: [{ model: User, attributes: ["id", "firstName", "lastName", "email"] }],
        order: [["createdAt", "DESC"]]
      });
      res.json(kycs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la récupération des KYC" });
    }
  };
}

module.exports = new KycController();