const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

/**
 * Get a fragment's metadata by its ID
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    logger.debug({ id: fragment.id }, 'Getting fragment metadata');

    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (err) {
    logger.warn({ err }, 'Fragment metadata not found');
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
