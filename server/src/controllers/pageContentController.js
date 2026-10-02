const PageContent = require('../models/PageContent');
const defaultPageContents = require('../utils/defaultPageContents');

const validPages = ['home', 'about', 'contact'];

// GET /api/page-content/:pageKey (Public)
const getPageContent = async (req, res, next) => {
  try {
    const { pageKey } = req.params;
    if (!validPages.includes(pageKey)) {
      return res.status(400).json({ success: false, message: 'Halaman tidak valid' });
    }

    const doc = await PageContent.findOne({ pageKey });
    const defaultData = defaultPageContents[pageKey] || {};

    if (!doc) {
      return res.json({
        success: true,
        data: defaultData,
        isCustom: false,
      });
    }

    // Merge default with stored content to guarantee no missing fields
    const merged = { ...defaultData, ...(doc.content || {}) };

    return res.json({
      success: true,
      data: merged,
      isCustom: true,
      updatedAt: doc.updatedAt,
      updatedBy: doc.updatedBy,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/page-content/:pageKey (Superadmin only)
const updatePageContent = async (req, res, next) => {
  try {
    const { pageKey } = req.params;
    if (!validPages.includes(pageKey)) {
      return res.status(400).json({ success: false, message: 'Halaman tidak valid' });
    }

    const { content } = req.body;
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ success: false, message: 'Data konten tidak valid' });
    }

    const updated = await PageContent.findOneAndUpdate(
      { pageKey },
      {
        pageKey,
        content,
        updatedBy: req.user?.username || 'superadmin',
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: `Konten halaman ${pageKey} berhasil disimpan!`,
      data: updated.content,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/page-content/:pageKey/reset (Superadmin only)
const resetPageContent = async (req, res, next) => {
  try {
    const { pageKey } = req.params;
    if (!validPages.includes(pageKey)) {
      return res.status(400).json({ success: false, message: 'Halaman tidak valid' });
    }

    await PageContent.findOneAndDelete({ pageKey });
    const defaultData = defaultPageContents[pageKey] || {};

    res.json({
      success: true,
      message: `Konten halaman ${pageKey} berhasil dikembalikan ke pengaturan bawaan!`,
      data: defaultData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPageContent,
  updatePageContent,
  resetPageContent,
};
