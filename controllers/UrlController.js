const short = require('short-uuid');
const UrlShorten = require('../models/UrlShorten');

module.exports = {
	GENERATE_URL,
	REDIRECT_URL
};

async function REDIRECT_URL(req, res) {
	const errorObj = { error: 'invalid URL' };
	const { shortURL } = req.params;
	if (!shortURL) res.json(errorObj);

	try {
		const findURL = await UrlShorten.findOne({ short_url: shortURL });
		if (!findURL) res.json(errorObj);

		const httpRegex = new RegExp('^(http|https)://', 'i');

		if (httpRegex.test(findURL.original_url)) res.redirect(301, findURL.original_url);
		res.redirect(301, `http://${findURL.original_url}`);
	} catch (e) {
		res.json({ error: e.message });
	}
}

async function GENERATE_URL(req, res) {
	const { body } = req;
	const errorObj = { error: 'invalid URL' };

	if (!body.url) res.json(errorObj);

	const regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	if (!regex.test(body.url)) res.json(errorObj);

	const short_url = short().new();
	const newUrl = {
		original_url: body.url,
		short_url
	};

	try {
		let shorUrl = new UrlShorten(newUrl);
		await shorUrl.save();
		res.json(newUrl);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
}
