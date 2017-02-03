const QUERY = {};

QUERY.HOME = {
	GetNavList: 'select v.`created_dt`as updated_dt, ch.`channel_id`, ch.`title`, ch.`created_dt`, sum(v.`hits`)as hits, ch.`group_id`, ch.`active`, ch.`priority` from `channel`as ch left join (select *from `video` where `active`=true order by `created_dt` desc) as v on ch.`channel_id` = v.`channel_id` where ch.`active` =1 and not exists (select *from `group` where `title` = ch.`title`) group by ch.`channel_id` order by ch.`priority` asc;'
    , GetRecomList: 'select * from `recommend_channel` as rc ' +
    'where rc.active = true ' +
    'order by `priority` desc ' +
    'limit 3;'
    , GetNavAllList: 'select ' +
    'if(g.title is null, c.title, g.title) as title, ' +
    'if(count(g.`group_id`)=0,\'single\',\'group\') as type, ' +
    'group_concat(c.`channel_id` order by c.priority asc) as group_channel_id, ' +
    'group_concat(c.title order by c.priority asc) as group_channel_title, ' +
    'if(g.group_id is null, c.title ,g.group_id) as group_id ' +
    'from `channel` as c ' +
    'left join `group` as g ' +
    'on c.group_id = g.group_id ' +
    'where c.active=true ' +
    'group by group_id ' +
    'order by c.priority asc;' // todo 우선순위에 대한 로직은 asc가 아니라 desc가 되어야 한다
};

QUERY.USER = {
	Login: 'select `user_id`, `password`, `nickname`, `name`, `email`, `login_fail_count`, `banned`, `market_code` from `user` where `user_id`=?;',
	FailToLogin: 'update `user` set `login_fail_count`=`login_fail_count`+1 where `user_id`=?;',
	ClearFailedCount: 'update `user` set `login_fail_count`=0  where `user_id`=?;',
	UpdateGameLog: 'insert into `log_access_game` set `user_id` = ?, `last_login_dt` = ?;',
	SignUp: 'insert into `user` set ?;',
	DuplicateByUserId: 'select `user_id` from `user` where `user_id` = ?;',
	DuplicateByNickname: 'select `nickname` from `user` where `nickname` = ?;',
	DuplicateByEmail: 'select `email` from `user` where `email` = ?;',
};

QUERY.Reply = {
	Write: 'insert into `reply_video` set ?;',
	Modify: 'update `reply_video` set `comment` =? where `id` = ?;',
	Remove: 'delete from `reply_video` where `id` =?'
};

QUERY.ReReply = {
	Write: 'insert into `reply_video` set ?;',
	Modify: 'update `reply_video` set `comment` =? where `id` = ?;',
	Remove: 'delete from `reply_video` where `id` =?'
};

QUERY.Common = {
	SearchAdminById : 'select *from `admin` where `admin_id` = ?;'
};


QUERY.Broadcast = {
	LiveOn : 'insert into `broadcast` set ?;',
	LiveEnd : 'update `broadcast` set `end_dt` = ?, `status` = 0 where `id` = ?',
	CalendarWrite: 'insert into `broadcast_calendar` set ?;'
};
module.exports = QUERY;