const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const type = req.get('Content-Type');

  if (!Fragment.isSupportedType(type) || !Buffer.isBuffer(req.body)) {
    logger.warn({ type }, 'Unsupported fragment type');

    return res.status(415).json(createErrorResponse(415, 'Unsupported Content-Type'));
  }

  const fragment = new Fragment({
    ownerId: req.user,
    type,
  });

  await fragment.setData(req.body);

  const apiUrl = process.env.API_URL || `${req.protocol}://${req.headers.host}`;

  const location = new URL(`/v1/fragments/${fragment.id}`, apiUrl);

  logger.info({ id: fragment.id }, 'Fragment created');

  res.status(201).location(location.toString()).json(
    createSuccessResponse({
      fragment,
    })
  );
};
