const router = require('express')();
const TransactionsFactory = require('../database/transactionFactory');
const { validators, verifyToken, authorization } = require('../middleware');
const userTransactions = TransactionsFactory.creating(
  'commonTransactions',
  'tblUser'
);
const userValidator = validators.userValidator;
const tokenControl = verifyToken.tokenControl;
const authControl = authorization.authControl;
const userStatusAuthControl = authorization.userStatusAuthControl;
const HttpStatusCode = require('http-status-codes');

router.get(
  '/user',
  tokenControl,
  authControl,
  userValidator.limitAndOffset,
  async (req, res) => {
    try {
      const result = await userTransactions.selectAsync(req.query);
      res.json(result);
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_err)
        .send(err.message);
    }
  }
);

router.get(
  '/user/:Id',
  tokenControl,
  authControl,
  userValidator.paramId,
  async (req, res) => {
    try {
      const result = await userTransactions.findOneAsync(req.params);
      res.json(result || {});
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_err)
        .send(err.message);
    }
  }
);

router.delete(
  '/user',
  tokenControl,
  authControl,
  userValidator.bodyId,
  async (req, res) => {
    try {
      const result = await userTransactions.deleteAsync(req.body);
      if (!result.affectedRows) {
        res
          .status(HttpStatusCode.GONE)
          .send('There is no such user ID in the system !');
        return;
      }
      res.json('The user registration was deleted successfully.');
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_err)
        .send(err.message);
    }
  }
);

router.put(
  '/user',
  tokenControl,
  authControl,
  userValidator.update,
  userStatusAuthControl,
  async (req, res) => {
    try {
      const result = await userTransactions.updateAsync(req.body, {
        Id: req.body.Id
      });
      if (!result.affectedRows) {
        res
          .status(HttpStatusCode.GONE)
          .send('There is no such user ID in the system !');
        return;
      }
      res.json('User information has been updated');
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_err)
        .send(err.message);
    }
  }
);

router.post(
  '/user',
  tokenControl,
  authControl,
  userValidator.insert,
  userStatusAuthControl,
  async (req, res) => {
    try {
      const result = await userTransactions.insertAsync(req.body);
      if (!result.affectedRows) {
        res
          .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
          .send('There was a problem adding the user !');
        return;
      }
      res.json('User registered.');
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_err)
        .send(err.message);
    }
  }
);

module.exports = router;