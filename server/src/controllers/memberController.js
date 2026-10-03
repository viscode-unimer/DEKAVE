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

const sanitizeField = (val) => typeof val === 'string' ? val.replace(/[\u200B-\u200D\uFEFF\u2060]/g, '').trim() : val;

const createMember = async (req, res, next) => {
  try {
    let photo = '';
    if (req.file) {
      photo = await uploadToCloudinary(req.file.buffer, 'dekave/members');
    }
    const data = { ...req.body, photo };
    if (data.name) data.name = sanitizeField(data.name);
    if (data.position) data.position = sanitizeField(data.position);
    if (data.division) data.division = sanitizeField(data.division);
    if (data.major) data.major = sanitizeField(data.major);

    const member = await Member.create(data);
    res.status(201).json({ success: true, data: member });
  } catch (error) { next(error); }
};

const updateMember = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (req.file) {
      update.photo = await uploadToCloudinary(req.file.buffer, 'dekave/members');
    }
    if (update.name) update.name = sanitizeField(update.name);
    if (update.position) update.position = sanitizeField(update.position);
    if (update.division) update.division = sanitizeField(update.division);
    if (update.major) update.major = sanitizeField(update.major);

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
