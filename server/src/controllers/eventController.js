const Event = require('../models/Event');
const { uploadToCloudinary } = require('../config/cloudinary');

const getEvents = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 9 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Event.countDocuments(filter),
    ]);
    res.json({ success: true, data: events, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) { next(error); }
};

const createEvent = async (req, res, next) => {
  try {
    let poster = '';
    if (req.file) {
      poster = await uploadToCloudinary(req.file.buffer, 'dekave/events');
    }
    const event = await Event.create({ ...req.body, poster });
    res.status(201).json({ success: true, data: event });
  } catch (error) { next(error); }
};

const updateEvent = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (req.file) {
      update.poster = await uploadToCloudinary(req.file.buffer, 'dekave/events');
    }
    const event = await Event.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) { next(error); }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) { next(error); }
};

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
