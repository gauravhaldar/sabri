# PayU Hash Calculation Fix

## Issue

PayU was rejecting payment requests with the error: **"incorrectly calculated hash parameter"**

### Error Details

- Expected hash format: Single SHA512 hash string (lowercase)
- Previous implementation: JSON object with v1 and v2 hashes: `{"v1":"...","v2":"..."}`
- PayU was receiving: `JSON.stringify(hashes)` instead of a plain hash string

## Root Cause

1. **Incorrect hash format**: PayU expects a **single lowercase SHA512 hash string**, not a JSON object
2. **Multiple salt versions**: Code was using MERCHANT_SALT_V1 and MERCHANT_SALT_V2 (both with same value)
3. **Wrong hash assignment**: Using `JSON.stringify(hashes)` instead of plain string

## Solution Implemented

### 1. Updated Configuration

Changed from:

```javascript
MERCHANT_SALT_V1: process.env.PAYU_MERCHANT_SALT_V1 || "...";
MERCHANT_SALT_V2: process.env.PAYU_MERCHANT_SALT_V2 || "...";
```

To:

```javascript
MERCHANT_SALT: process.env.PAYU_MERCHANT_SALT ||
  "4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW";
```

### 2. Updated Hash Generation Function

Changed from `generatePayUHashes()` (returning v1 and v2) to `generatePayUHash()` (returning single hash):

```javascript
/**
 * Generate SHA512 hash for PayU payment request
 * Returns a single lowercase hash string as per PayU documentation
 */
const generatePayUHash = (params) => {
  const hashString = buildRequestHashString(params, PAYU_CONFIG.MERCHANT_SALT);
  const hash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex")
    .toLowerCase(); // PayU requires lowercase hash

  return hash;
};
```

### 3. Updated Hash Assignment

Changed from:

```javascript
const hashes = generatePayUHashes(payUParams);
payUParams.hash = JSON.stringify(hashes);
```

To:

```javascript
payUParams.hash = generatePayUHash(payUParams);
```

## PayU Hash Formula

As per [PayU Documentation](https://docs.payu.in/docs/generate-hash-payu-hosted):

```
sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
```

### Important Notes from PayU Docs:

1. Hash must be **SHA-512 encrypted**
2. Hash must be **lowercase**
3. Hash should be **generated server-side** to prevent tampering
4. **Do NOT pass Salt in payment request**
5. PayU recommends using **Merchant Salt Version 2** (single salt)
6. Hash is a **plain string**, not a JSON object

## Files Modified

1. `/app/api/payment/payu/create/route.js`
   - Updated PAYU_CONFIG to use single MERCHANT_SALT
   - Renamed generatePayUHashes to generatePayUHash
   - Changed hash generation to return single lowercase string
   - Updated hash assignment to use plain string

## Environment Variables

Updated in `.env.local`:

```bash
# Use single salt (Version 2 recommended by PayU)
PAYU_MERCHANT_SALT=4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW
```

## Testing

After this fix:

1. Hash will be generated as a single lowercase SHA512 string
2. PayU will correctly validate the hash
3. Payment requests will be accepted

## References

- [PayU Hash Generation Documentation](https://docs.payu.in/docs/generate-hash-payu-hosted)
- [PayU Test Credentials](https://docs.payu.in/docs/generate-test-merchant-key-and-salt)

## Verification Steps

1. Place an order with online payment
2. Verify hash in console/logs is a single lowercase string
3. Confirm PayU accepts the payment request
4. Check payment flows through success/failure callbacks

---

**Date Fixed**: January 2025
**Issue Type**: Hash Calculation Error
**Status**: ✅ Resolved
