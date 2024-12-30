import { v4 as createUuidV4 } from 'uuid';

const uuid = {
    create: function () {
        return createUuidV4().replace(/-/g, '');
    }
};

export { uuid };
