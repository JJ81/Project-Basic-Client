/**
 * Created by yijaejun on 15/12/2016.
 */
var RedisDAO = {};

RedisDAO.QueryDataByKeyName = (reqCache, key, callback) => {
	return reqCache.get(key, callback);
};

RedisDAO.CacheWithKeyName = (reqCache, key, value, callback) => {
	return reqCache.set(key, value, callback);
};

RedisDAO.DeleteByKeyName = (reqCache, key, callback) => {
	return reqCache.del(key, callback);
};

RedisDAO.GetKeysWithPattern = (reqCache, key, callback) => {
	return reqCache.keys(key, callback);
};

RedisDAO.DeleteByKeyPattern = (reqCache, key, callback) => {
	reqCache.keys(key, function (err, keyList) {
		return reqCache.del(keyList, callback);
	});
};

module.exports = RedisDAO;