module.exports = function (app, endpoint, express) {
  var router = express.Router();

  router.get(endpoint, function (req, res) {
    res.json('Hello');
  });

  return router;
};
