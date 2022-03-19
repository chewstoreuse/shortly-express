const models = require('../models');
const Promise = require('bluebird');

var createSessionAndSetCookie = function (req, res, next) {
  return models.Sessions.create()
    .then(response => {
      models.Sessions.get({ id: response.insertId })
        .then(sesh => {
          req.session = { hash: sesh.hash };
          // console.log('session', sesh);
          res.cookies['shortlyid'] = { value: sesh.hash };
          next();
        });
    });
};

module.exports.createSession = (req, res, next) => {
  if (Object.keys(req.cookies).length === 0) {
    // models.Sessions.create()
    //   .then(response => {
    //     models.Sessions.get({ id: response.insertId })
    //       .then(sesh => {
    //         req.session = { hash: sesh.hash };
    //         // console.log('session', sesh);
    //         res.cookies['shortlyid'] = { value: sesh.hash };
    //         next();
    //       });
    //   })
    createSessionAndSetCookie(req, res, next)
      .catch(err => {
        res.status(500).send(err);
      });
  } else {
    models.Sessions.getAll()
      .then(allSessions => {
        var match = allSessions.filter(s => s.hash === req.cookies.shortlyid);

        if (match.length) {
          models.Users.get({ id: match[0].userId })
            .then(user => {
              req.session = {
                user: { username: user ? user.username : null },
                userId: match[0].userId,
                hash: req.cookies.shortlyid
              };
              next();
            });
        } else {
          createSessionAndSetCookie(req, res, next)
            .catch(err => {
              res.status(500).send(err);
            });
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

