/**
 * Created by cheese on 2017. 2. 7..
 */
const
    mysql_dbc = require('../commons/db_conn')(),
    connection = mysql_dbc.init(),
    QUERY = require('../database/query'),
    Content = {};

Content.register = (ref_id, type, callback) => {
    const _values={
        ref_id: ref_id,
        type: type,
        created_dt : new Date(),
        priority: null,
        active: 0
    };
    connection.query(QUERY.Content.Register, _values, (err, result) => {
        callback(err, result);
    });
};

Content.delete = (id, callback) => {
    connection.query(QUERY.Content.Delete, id, (err, result) => {
        callback(err, result);
    });
};

Content.update= (id, ref_id, type, callback) =>{
    connection.query(QUERY.Content.Update, [ref_id, type, id], (err, result)=>{
        callback(err, result);
    });
};
module.exports = Content;
    