const Camavis = require('../models/Camavis');
const Setting = require('../models/Setting');

const DEFAULT_SETTINGS = {
  isOpen: false,
  period: 'Semester Depan',
  announcement: 'Pendaftaran Calon Mahasiswa Viscode (CAMAVIS) saat ini telah ditutup. Kami akan membuka pendaftaran kembali pada semester depan. Pantau terus linimasa media sosial kami agar tidak ketinggalan jadwal seleksi gelombang selanjutnya!',
  whatsappNumber: '6282289456789',
  instagramHandle: 'dkv.unimer',
};

const getCamavisSettings = async (req, res, next) => {
  try {
    let setting = await Setting.findOne({ key: 'camavis_settings' });
    if (!setting) {
      setting = await Setting.create({
        key: 'camavis_settings',
        value: DEFAULT_SETTINGS,
      });
    }
    res.json({ success: true, data: setting.value });
  } catch (error) { next(error); }
};

const updateCamavisSettings = async (req, res, next) => {
  try {
    const { isOpen, period, announcement, whatsappNumber, instagramHandle } = req.body;
    const value = {
      isOpen: Boolean(isOpen),
      period: period || DEFAULT_SETTINGS.period,
      announcement: announcement || DEFAULT_SETTINGS.announcement,
      whatsappNumber: whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
      instagramHandle: instagramHandle || DEFAULT_SETTINGS.instagramHandle,
    };
    const setting = await Setting.findOneAndUpdate(
      { key: 'camavis_settings' },
      { key: 'camavis_settings', value },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: setting.value, message: 'Pengaturan CAMAVIS berhasil diperbarui' });
  } catch (error) { next(error); }
};

const submitCamavis = async (req, res, next) => {
  try {
    // Check if registration is open
    const setting = await Setting.findOne({ key: 'camavis_settings' });
    const isOpen = setting ? setting.value?.isOpen : false;
    if (isOpen === false) {
      return res.status(400).json({
        success: false,
        message: 'Mohon maaf, pendaftaran CAMAVIS saat ini sedang ditutup dan akan dibuka kembali pada semester depan.',
      });
    }

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

module.exports = {
  getCamavisSettings,
  updateCamavisSettings,
  submitCamavis,
  getCamavisList,
  getCamavisById,
  updateCamavisStatus,
  deleteCamavis,
};
