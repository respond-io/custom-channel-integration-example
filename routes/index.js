/* eslint-disable new-cap */
const express = require('express');
const axios = require('axios')

/**
 * ClickSend: https://clicksend.com (SMS Provider)
 */
const api = require('./api.js');

/**
 * Respond.io custom channel API Token
 */
const CHANNEL_API_TOKEN = '<API Token>';

const router = express.Router();


/**
 * Example for handling outbound messages FROM respond.io TO ClickSend: https://clicksend.com
 */
router.post('/message', (req, res) => {
  /**
     * Authentication
     * Get the bearer token from request header
     * Check token against channel API token provided by respond.io
     */
  const bearerToken = req.headers.authorization;
  if (!bearerToken || bearerToken.substring(7, bearerToken.length) !== CHANNEL_API_TOKEN) {
    return res.status(401);
  }

  /**
   * Sending SMS using third party sms provider i.e (ClickSend: https://clicksend.com)
   */
  const smsMessage = new api.SmsMessage();


  const phoneNumber = req.body.contactId;
  const message = req.body.message.text;

  smsMessage.source = "sdk";
  smsMessage.to = phoneNumber;
  smsMessage.body = message;

  const smsCollection = new api.SmsMessageCollection();

  smsCollection.messages = [smsMessage];

  smsApi.smsSendPost(smsCollection)
      .then(r => {
        res.send({mId: r.data.messages[0].message_id})
      })
      .catch(e => {
        switch (e.response.status) {
          case 401:
            res.status(400)
                .send({'error': {'message': '401: UNAUTHORIZED'}})
            break;
          default:
            res.status(400)
                .send({'error': {'message': `err: status_code #${e.response.status} `}})
        }
      });
});


/**
 * Example for handling inbound messages FROM ClickSend: https://clicksend.com TO respond.io
 */
router.post('/clicksend/push_message', (req, res) => {

  /**
   * Reference for push message
   * https://developers.clicksend.com/docs/rest/v3/#view-inbound-sms
   *
   * We will be preparing the data for the webhook
   * We will be sending generated data to the respond.io
   */
  const messageId = res.data.message_id;
  const from = res.data.from;
  const messageBody = res.data.body;
  // converts ClickSend timestamp to milliseconds
  const timestamp = (res.data.timestamp * 1000);

  const data = {
    channelId: "gfd8g7fd89dgfd",
    contactId: from,
    events: [
      {
        type: "message",
        mId: messageId,
        timestamp,
        message: {
          type: "text",
          text: messageBody
        }
      }
    ]
  }


  // Calls respond.io webhook
  axios({
    method: 'post',
    url: 'https://app.respond.io/custom/webhook',
    headers: {
      'authorization': `Bearer ${CHANNEL_API_TOKEN}`,
      'content-type': 'application/json',
      'cache-control': 'no-cache'
    },
    data
  });

});

module.exports = router;
