const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

const MarkdownIt = require('markdown-it');

/**
 * Get a fragment by its ID
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const data = await fragment.getData();

    logger.debug({ id: fragment.id }, 'Getting fragment');

    const accept = req.get('Accept') || '*/*';

    if (accept !== '*/*' && !req.accepts(fragment.formats)) {
      return res.status(406).json(createErrorResponse(406, 'Not Acceptable'));
    }

    if (
      fragment.mimeType === 'text/markdown' &&
      req.accepts('text/html') &&
      !req.accepts('text/markdown')
    ) {
      const md = new MarkdownIt();
      res.set('Content-Type', 'text/html');
      return res.status(200).send(md.render(data.toString()));
    }

    res.set('Content-Type', fragment.type);
    res.status(200).send(data);

    if (accept !== '*/*' && !req.accepts(fragment.formats)) {
      return res.status(406).json(createErrorResponse(406, 'Not Acceptable'));
    }

    res.set('Content-Type', fragment.type);
    res.status(200).send(data);
  } catch (err) {
    logger.warn({ err }, 'Fragment not found');
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
