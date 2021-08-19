const crypto = require('crypto');
const config = require('../config/environment');
const ENCRYPTION_KEY = config.aes.encryptionKey; // Must be 256 bits (32 characters)
const IV_LENGTH = 16;

module.exports = {
	decrypt(text) {
		let textParts = text.split(':');
		let iv = Buffer.from(textParts.shift(), 'hex');
		let encryptedText = Buffer.from(textParts.join(':'), 'hex');
		let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	},
	encrypt(text) {
		let iv = crypto.randomBytes(IV_LENGTH);
		let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
		let encrypted = cipher.update(text);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return iv.toString('hex') + ':' + encrypted.toString('hex');
	}
}
