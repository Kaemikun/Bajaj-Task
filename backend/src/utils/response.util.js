const { OFFICIAL_EMAIL } = require("../config/env");

function successResponse(data) {
  return {
    is_success: true,
    official_email: OFFICIAL_EMAIL,
    data,
  };
}

module.exports = { successResponse };
