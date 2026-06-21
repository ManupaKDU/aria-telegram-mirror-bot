const {escapeHTML} = require('./src/bot_utils/msg-tools') || {};
console.log(escapeHTML ? escapeHTML('<test>') : 'not found');
