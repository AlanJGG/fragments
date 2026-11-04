const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');

const router = express.Router();

// Parse supported fragment content types as Buffers
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      try {
        const { type } = contentType.parse(req);
        return Fragment.isSupportedType(type);
      } catch {
        return false;
      }
    },
  });

router.get('/fragments', require('./get'));
router.get('/fragments/:id/metadata', require('./getMetadata'));
router.get('/fragments/:id', require('./getById'));
router.post('/fragments', rawBody(), require('./post'));
module.exports = router;
