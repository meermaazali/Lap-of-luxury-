import crypto from 'crypto';

// Vercel Serverless Function: /api/phonepe (handles initiation, status, and callback)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-VERIFY');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, transactionId, amount, orderId, customerPhone } = req.body || req.query || {};

  // Credentials can come from Environment Variables or Request
  const merchantId = process.env.PHONEPE_MERCHANT_ID || 'M22XXXXXXXX';
  const saltKey = process.env.PHONEPE_SALT_KEY || '';
  const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
  const env = process.env.PHONEPE_ENV || 'SANDBOX';

  // 1. Transaction Status Check
  if (req.method === 'GET' || action === 'status' || transactionId) {
    const txnId = transactionId || req.query.txn;
    if (!txnId) {
      return res.status(400).json({ success: false, message: 'Missing transactionId' });
    }

    if (!saltKey) {
      return res.status(200).json({
        success: false,
        verified: false,
        status: 'PENDING',
        message: 'PhonePe Salt Key not configured in environment.',
      });
    }

    const stringToHash = `/pg/v1/status/${merchantId}/${txnId}` + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerify = `${sha256}###${saltIndex}`;

    const host =
      env === 'PRODUCTION'
        ? 'https://api.phonepe.com/apis/hermes'
        : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

    try {
      const response = await fetch(`${host}/pg/v1/status/${merchantId}/${txnId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
          'X-MERCHANT-ID': merchantId,
        },
      });

      const data = await response.json().catch(() => ({}));
      const isSuccess = data?.code === 'PAYMENT_SUCCESS';

      return res.status(200).json({
        success: isSuccess,
        verified: isSuccess,
        status: data?.code || 'UNKNOWN',
        message: data?.message || '',
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  // 2. Initiate Payment Checkout
  if (req.method === 'POST') {
    if (!saltKey || !merchantId) {
      return res.status(200).json({
        success: false,
        configured: false,
        code: 'CREDENTIALS_REQUIRED',
        message: 'PhonePe Merchant ID and Salt Key are required.',
      });
    }

    const txnId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const numericAmount = Math.round(Number(amount || 0) * 100);
    const hostUrl = req.headers.referer ? new URL(req.headers.referer).origin : 'https://lapofluxury.in';
    const redirectUrl = `${hostUrl}/?payment_status=success&txn=${txnId}&orderId=${orderId || ''}`;
    const callbackUrl = `${hostUrl}/api/phonepe`;

    const payload = {
      merchantId,
      merchantTransactionId: txnId,
      merchantUserId: `CUST_${(customerPhone || '9848263939').replace(/\D/g, '') || '9848263939'}`,
      amount: numericAmount,
      redirectUrl,
      redirectMode: 'REDIRECT',
      callbackUrl,
      mobileNumber: (customerPhone || '9848263939').replace(/\D/g, '').slice(-10),
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const stringToHash = base64Payload + '/pg/v1/pay' + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerify = `${sha256}###${saltIndex}`;

    const apiUrl =
      env === 'PRODUCTION'
        ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
        : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

    try {
      const phonepeResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
        },
        body: JSON.stringify({ request: base64Payload }),
      });

      const phonepeData = await phonepeResponse.json().catch(() => ({}));

      if (phonepeData && phonepeData.success && phonepeData.data?.instrumentResponse?.redirectInfo?.url) {
        return res.status(200).json({
          success: true,
          configured: true,
          transactionId: txnId,
          redirectUrl: phonepeData.data.instrumentResponse.redirectInfo.url,
        });
      }

      return res.status(200).json({
        success: false,
        configured: true,
        message: phonepeData.message || 'Failed to initiate PhonePe PG',
        raw: phonepeData,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
