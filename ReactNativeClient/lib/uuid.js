const { v4: createUuidV4 } = require('uuid');

const uuid = {
    create: function () {
        return createUuidV4().replace(/-/g, '');
    }
};

module.exports = { uuid };
