require('dotenv').config();
const axios = require('axios');
const {nanoid} = require('nanoid');

(async () => {
  try {
    const options = {
      headers: {
        'Authorization': `Bearer ${process.env.CHANNEL_TOKEN}`,
      },
    };

    const mId = nanoid();
    const body = {
      'channelId': process.env.CHANNEL_ID,
      'contactId': process.env.CONTACT_ID || 'thisIsYourContactId',
      'events': [{
        'type': 'message',
        'mId': mId,
        'timestamp': Date.now(),
        'message': { // MUF
          'type': 'text',
          'text': 'Hello World ' + Date.now(),
        },
      }],

      // Optional - It is used in contact creation
      'contact': {
        'firstName': 'Leo',
        'lastName': 'Wong',
        'profilePic': 'https://assets-global.website-files.com/6030eb20edb26744961d31ee/61a71a4aa8ad2026da9f3eb3_respondio-rgb-black.svg',
        'locale': 'en_US',
        'countryCode': 'MY',
        'timezone': 8,
        'email': 'tech@rocketbots.io',
        'phone': '+60123456789',
        'language': 'en',
      },
    };

    await axios.post(process.env.WEBHOOK_URL, body, options);
    console.log('Message webhook is delivered.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.message);
  }
  process.exit(0);
})();
