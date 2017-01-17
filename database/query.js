var QUERY = {};

QUERY.HOME = {
  READ: "select * from `agent_wallet_history` as awh " +
  "where `agent_id`= ? " +
  "order by `date` desc limit 1000;",
  READBYDATE: "select * from `agent_wallet_history` as awh " +
  "where `agent_id`= ? and `date` >= ? and `date` <= ?" +
  "order by `date` desc limit 1000;",
  LOG_WALLET: 'insert into `agent_wallet_history` set ?'
};


QUERY.HOME_INFO = {
  LOG_CREDIT_INFO: {
    agent_id: null,
    type: null,
    amount: null,
    balance: null,
    target_agent_id: null,
    target_player_id: null,
    memo: null
  }
};


QUERY.AGENT = {
  delete: "",
  QUERYALL: 'select * from `agent`;',
  login: 'select * from `agent` where `code`=?',
  create: 'insert into `agent` set ?;',
  changePassword: 'update `agent` set `password` = ? where `code` = ?;',
  SUSPEND: 'update `agent` set `suspend` = ? where `code` = ?;'
  ,
  READ_ALL_AGENT: 'select * from `agent` order by `layer` asc;'
  ,
  READ_ONE_AGENT: 'select * from `agent` where `code`=?;'
  ,
  READ_AGENT_TOP_TIER: 'select * from `agent` where `layer` is not null and `layer` <= 3 order by `layer` asc;'
  ,
  READ_AGENT_LIST_LAYER_1: 'select * from `agent` where `top_parent_id` = ? and `layer` >= ? order by `layer` asc;'
  ,
  READ_AGENT_LIST_LAYER_2: 'select * from `agent` where `code`=? or `parent_id`=? order by `layer` asc;'
  ,
  READ_AGENT_LIST_LAYER_3: 'select * from `agent` where `code`=?;'
  ,
  UPDATE_AMOUNT_CREDIT: 'update `agent` set `balance` = `balance` + ? where `code`= ?;'
  ,
  UPDATE_AMOUNT_DEBIT: 'update `agent` set `balance` = `balance` - ? where `code`= ?;'
  ,
  READ_CURRENT_BALANCE:
    "select `balance` from `agent` where `code` in (?) " +
    "order by `layer` asc;"
  ,
  READ_BALANCE: 'select `balance` from `agent` where `code` = ?'
  ,
  GetAgentListByLayer: "select a.code, a.balance, a.parent_id, a.layer, a.suspend, if(plr.count is null, 0, plr.count) as player_count " +
  "from `agent` as a " +
  "left join ( " +
  "SELECT u.market_code as agent, COUNT(*) as count " +
  "FROM `user` as u " +
  "where u.market_code is not null " +
  "GROUP BY market_code " +
  ") as plr " +
  "on plr.agent = a.code " +
  "where a.layer > ? or a.code = ? " +
  "order by `layer` asc;"
  ,GetAgentBalance : "select `balance` from `agent` where `code`=?;"
};


QUERY.PLAYER = {
  READ: 'select * ' +
  'from `user` as u order by `signup_dt` desc;'
  ,
  READ_BOTTOM_LAYERS_PLAYER: 'select * ' +
  'from `user` as u where `top_parent_id`=? order by `signup_dt` desc;'
  ,
  READ_ALL_PLAYER: 'select * ' +
  'from `user` as u order by `signup_dt` desc;'
  ,
  READ_SOME_PLAYER: 'select * ' +
  'from `user` as u where `market_code`=? and `mark` ' +
  'order by `signup_dt` desc;'
  ,
  GetPlayerListByAgentList: "select * from `user` where `market_code` in (?);"

  ,
  READ_AGENT_LIST: 'select * from `agent` where `top_parent_id` = ? and `layer` >= ?; '
  ,
  READ_PLAYER_LAYER_3: 'select * ' +
  ' from `user` as u where u.`market_code` = ? ' +
  'order by `signup_dt` desc;'
  ,
  READ_PAYER_LAYER_1: 'select * from `user` where `market_code` in (?) order by `signup_dt` desc;'
  ,
  UPDATE_CREDIT: 'update `user` set `balance` =? where `user_id` =?;'
  ,
  UPDATE_AMOUNT_CREDIT: 'update `user` set `balance` = `balance` +? where `user_id` = ?;'
  ,
  UPDATE_AMOUNT_DEBIT: 'update `user` set `balance` = `balance` - ? where `user_id` = ?;'
  ,
  CREATE_USER_WALLET_LOG: 'insert into `user_wallet_history` set ? '
  ,
  QueryBalanceDataByUserName: "select uwh.date, uwh.user_id as username, uwh.credit, uwh.debit, '' as fee, '' as ruby, uwh.actor " +
  "from `user_wallet_history` as uwh " +
  "left join `user` as u " +
  "on u.user_id = uwh.user_id " +
  "where uwh.`user_id`=? " +
  "and uwh.date >= ? and uwh.date <= ? " +
  "union " +
  "select ugh.date, ugh.user_id as username, '' as credit, '' as debit, ugh.fee, ugh.ruby, '' as actor " +
  "from `user_game_history` as ugh " +
  "where ugh.user_id=? " +
  "and ugh.date >= ? and ugh.date <= ? " +
  "order by `date` desc;"
  ,
  GetPlayerCountByAgentName: "select count(*) as player from `user` where market_code=?;"

  ,
  UPDATE_SUSPEND: 'update `user` set `banned`= ? where `user_id` = ?;'
  ,
  UPDATE_SET_PASSWORD : 'update `user` set `password` =? where `user_id`= ?;'

};


QUERY.GAME = {
  'GetGameDataByDate': // per player
    "select `ugh`.`user_id` as username, sum(`ugh`.`ruby`) as ruby, sum(`ugh`.`fee`) as fee, u.market_code as agent, u.banned, u.nickname " +
    "from `user_game_history` as ugh " +
    "left join `user` as u " +
    "on `ugh`.`user_id` = `u`.`user_id` " +
    "where `date` >= ? and `date` <= ? " +
    "and u.`market_code` in (?) " +
    "group by `username` " +
    "order by `username` desc;"
  ,'GetGameDataByDateWithAgent' : // per agent
    "select gd.agent, sum(gd.ruby) as ruby, sum(gd.fee) as fee " +
    "from ( " +
    "select ugh.date, ugh.user_id, sum(ugh.ruby) as ruby, sum(ugh.fee) as fee, u.market_code as agent " +
    "from `user_game_history` as ugh " +
    "left join `user` as u " +
    "on u.user_id = ugh.user_id " +
    "where ugh.date >= ? and ugh.date <= ? " +
    "and u.`market_code` in (?) " +
    "group by ugh.user_id " +
    ") as gd " +
    "group by `agent`;"
  ,'GetGameDataByDateWithDay' : // per day
    "select ugh.date,  sum(ugh.ruby) as ruby, sum(ugh.fee) as fee " +
    "from `user_game_history` as ugh " +
    "left join `user` as u " +
    "on u.user_id = ugh.user_id " +
    "where ugh.date >= ? and ugh.date <= ? " +
    "and u.`market_code` in (?)  " +
    "group by ugh.date " +
    "order by ugh.date desc;"
  ,'SetGameHistoryByDate' :
    'insert into `user_game_history` (`date`,`fee`, `ruby`, `user_id`) values ?;'
};


QUERY.FINANCIAL = {

  'GetFinancialDataByDate':
    "select ugd.username, ugd.nickname, ugd.agent, ugd.type, if (ugd.credit is null, 0, ugd.credit) as credit, if(ugd.debit is null, 0, ugd.debit) as debit, ugd2.ruby " +
    "from " +
    "(select uwh.date, u.user_id as username, u.nickname, u.market_code as agent, uwh.type, sum(uwh.credit) as credit, sum(uwh.debit) as debit " +
    "from `user_wallet_history` as uwh " +
    "left join `user` as u " +
    "on u.user_id = uwh.user_id " +
    "where uwh.`date` >= ? and uwh.`date` <= ? and u.market_code in (?) " +
    "group by `username` " +
    ") as ugd " +
    "left join ( " +
    "select ugh.user_id as username, sum(ugh.ruby) as ruby from `user_game_history` as ugh " +
    "where ugh.`date` >= ? and ugh.`date` <= ? " +
    "group by ugh.`user_id` " +
    ") as ugd2 " +
    "on ugd.username = ugd2.username;"
  // TODO per Agent
  ,'GetFinancialDataPerAgent' :
    "select a.code as agent, if(uwh_fd.credit is null, 0, uwh_fd.credit) as credit, if(uwh_fd.debit is null, 0, uwh_fd.debit) as debit, if(ugh_fd.ruby is null, 0, ugh_fd.ruby) as ruby " +
    "from `agent` as a " +
    "left join ( " +
    "select fd.agent, sum(fd.credit) as credit, sum(fd.debit) as debit " +
    "from ( " +
      "select uwh.date, uwh.user_id, uwh.credit, uwh.debit, u.market_code as agent " +
    "from `user_wallet_history` as uwh " +
    "left join `user` as u " +
    "on u.user_id = uwh.user_id " +
    "where uwh.date >= ? and uwh.date <= ? " +
    "and u.market_code in (?) " +
    ") as fd " +
    "group by fd.agent " +
    ") as uwh_fd " +
    "on a.code = uwh_fd.agent " +
    "left join ( " +
      "select fd.agent, sum(fd.ruby) as ruby " +
    "from " +
    "( " +
      "select ugh.user_id, sum(ugh.ruby) as ruby, u.market_code as agent " +
    "from `user_game_history` as ugh " +
    "left join `user` as u " +
    "on u.user_id = ugh.user_id " +
    "where ugh.date >= ? and ugh.date <= ? " +
    "and u.market_code in (?) " +
    "group by ugh.user_id " +
    ") as fd " +
    "group by fd.agent " +
    ") as ugh_fd " +
    "on a.code = ugh_fd.agent " +
    "where a.code in (?);"
  // TODO per Day
  ,'GetFinancialDataPerDay' :
    "select fd_pd.date, sum(fd_pd.credit) as credit, sum(fd_pd.debit) as debit, sum(fd_pd.ruby) as ruby from " +
    "( " +
    "select uwh_pd.date, sum(uwh_pd.credit) as credit, sum(uwh_pd.debit) as debit, null as ruby " +
    "from " +
    "( " +
    "select date(uwh.date) as date, uwh.credit, uwh.debit " +
    "from `user_wallet_history` as uwh " +
    "left join `user` as u " +
    "on u.user_id = uwh.user_id " +
    "where uwh.date >= ? and uwh.date <= ? " +
    "and u.market_code in (?) " +
    ") as uwh_pd " +
    "group by uwh_pd.date " +
    "union all " +
    "select ugh.date, null as credit, null as debit, sum(ugh.ruby) as ruby " +
    "from `user_game_history` as ugh " +
    "left join `user` as u " +
    "on u.user_id = ugh.user_id " +
    "where ugh.date >= ? and ugh.date <= ? " +
    "and u.market_code in (?) " +
    "group by ugh.date " +
    ") as fd_pd " +
    "group by fd_pd.date " +
    "order by fd_pd.date desc;"
};


module.exports = QUERY;