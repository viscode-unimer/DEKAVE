const Member = require('../models/Member');
const { uploadToCloudinary } = require('../config/cloudinary');

const getMembers = async (req, res, next) => {
  try {
    const { division, year, active } = req.query;
    const filter = {};
    if (division) filter.division = division;
    if (year) filter.year = year;
    if (active !== undefined && active !== 'all') {
      filter.isActive = active === 'true';
    }
    const members = await Member.find(filter).sort({ position: 1, name: 1 });
    res.json({ success: true, data: members });
  } catch (error) { next(error); }
};

const createMember = async (req, res, next) => {
  try {
    let photo = '';
    if (req.file) {
      photo = await uploadToCloudinary(req.file.buffer, 'dekave/members');
    }
    const member = await Member.create({ ...req.body, photo });
    res.status(201).json({ success: true, data: member });
  } catch (error) { next(error); }
};

const updateMember = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (req.file) {
      update.photo = await uploadToCloudinary(req.file.buffer, 'dekave/members');
    }
    const member = await Member.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (error) { next(error); }
};

const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (error) { next(error); }
};

module.exports = { getMembers, createMember, updateMember, deleteMember };
