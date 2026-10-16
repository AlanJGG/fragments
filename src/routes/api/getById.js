const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

/**
 * Get a fragment by its ID
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const data = await fragment.getData();

    logger.debug({ id: fragment.id }, 'Getting fragment');

    res.set('Content-Type', fragment.type);
    res.status(200).send(data);
  } catch (err) {
    logger.warn({ err }, 'Fragment not found');
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
