const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const fragments = await Fragment.byUser(req.user, req.query.expand === '1');

  res.status(200).json(
    createSuccessResponse({
      fragments,
    })
  );
};
