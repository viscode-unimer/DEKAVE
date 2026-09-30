const Camavis = require('../models/Camavis');

const submitCamavis = async (req, res, next) => {
  try {
    const { fullName, nickname, nim, faculty, major, phone, instagram, email, motivation, division, portfolioLink } = req.body;
    const existing = await Camavis.findOne({ $or: [{ nim }, { email }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'NIM or email already registered' });
    }
    const camavis = await Camavis.create({ fullName, nickname, nim, faculty, major, phone, instagram, email, motivation, division, portfolioLink });
    res.status(201).json({ success: true, message: 'Registration submitted successfully! We will contact you soon.', data: camavis });
  } catch (error) { next(error); }
};

const getCamavisList = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [list, total] = await Promise.all([
      Camavis.find(filter).sort({ submittedAt: -1 }).skip(skip).limit(Number(limit)),
      Camavis.countDocuments(filter),
    ]);
    res.json({ success: true, data: list, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

const getCamavisById = async (req, res, next) => {
  try {
    const camavis = await Camavis.findById(req.params.id);
    if (!camavis) return res.status(404).json({ success: false, message: 'Applicant not found' });
    res.json({ success: true, data: camavis });
  } catch (error) { next(error); }
};

const updateCamavisStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const camavis = await Camavis.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!camavis) return res.status(404).json({ success: false, message: 'Applicant not found' });
    res.json({ success: true, data: camavis });
  } catch (error) { next(error); }
};

const deleteCamavis = async (req, res, next) => {
  try {
    const camavis = await Camavis.findByIdAndDelete(req.params.id);
    if (!camavis) return res.status(404).json({ success: false, message: 'Applicant not found' });
    res.json({ success: true, message: 'Applicant deleted successfully' });
  } catch (error) { next(error); }
};

module.exports = { submitCamavis, getCamavisList, getCamavisById, updateCamavisStatus, deleteCamavis };
