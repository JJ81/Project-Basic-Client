var QUERY = {};

QUERY.HOME = {
  GetNavList :
    'select v.`created_dt`as updated_dt, ch.`channel_id`, ch.`title`, ch.`created_dt`, sum(v.`hits`)as hits, ch.`group_id`, ch.`active`, ch.`priority` from `channel`as ch left join (select *from `video` where `active`=true order by `created_dt` desc) as v on ch.`channel_id` = v.`channel_id` where ch.`active` =1 and not exists (select *from `group` where `title` = ch.`title`) group by ch.`channel_id` order by ch.`priority` asc;'
  ,GetRecomList :
    "select * from `recommend_channel` as rc " +
    "where rc.active = true " +
    "order by `priority` desc " +
    "limit 3;"
};

module.exports = QUERY;