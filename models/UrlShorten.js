const { Schema, model } = require('mongoose');

const urlSchema = new Schema(
	{
		original_url: String,
		short_url: {
			type: String,
			index: true,
			unique: true
		}
	},
	{ timestamps: true }
);

module.exports = model('UrlShorten', urlSchema);
