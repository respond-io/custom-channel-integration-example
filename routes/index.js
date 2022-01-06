/* eslint-disable new-cap */
const express = require('express');

/**
 * TeleSign (SMS Provider) configuration
 */
const TeleSignSDK = require('telesignsdk');
const telesign = new TeleSignSDK(
    'FFFFFFFF-EEEE-DDDD-1234-AB1234567890', // customerId
    'EXAMPLE----TE8sTgg45yusumoN4BYsBVkh+yRJ5czgsnCehZaOYldPJdmFh6NeX8kunZ2zU1YWaUw/0wV6xfw==', // apiKey
    'https://rest-api.telesign.com', // restEndpoint
);

/**
 * Respond.io custom channel API Token
 */
const CHANNEL_API_TOKEN = '<API Token>';


const router = express.Router();

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
     * Sending SMS using third party sms provider i.e (TeleSign)
     */
  const phoneNumber = req.body.contactId;
  const message = req.body.message.text;

  telesign.sms.message((e, r) => {
            e ? res.status(400).send({'error': {'message': e.res.message}}) :
                res.send({mId: r.reference_id});
  },
  phoneNumber,
  message,
  );
});

module.exports = router;
