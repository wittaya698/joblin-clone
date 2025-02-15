class ModelCache {
    constructor(maxSize) {
        this.cache_ = [];
        this.maxSize_ = maxSize;
    }

    fromCache(ModelClass, id) {
        throw new Error('ModelCache fromCache() need implementation');
    }

    cache(ModelClass, id, model) {
        throw new Error('ModelCache cache() need implementation');
    }

    async load(ModelClass, id) {
        throw new Error('ModelCache load() need implementation');
    }
}

module.exports = ModelCache;
