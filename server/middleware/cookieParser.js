const parseCookies = (req, res, next) => {
  var cookies = {};
  if (req.headers.cookie) {
    var cookieArr = req.headers.cookie.split('; ');

    cookieArr.forEach(c => {
      var cookie = c.split('=');
      cookies[cookie[0]] = cookie[1];
    });
  }

  req.cookies = cookies;
  next();
};

module.exports = parseCookies;