let connection;

const init = function (c) {
    connection = c;
}

const selectTags = function(){
    var sql = 'SELECT * FROM `asset`.`lib_tag` ORDER BY `id` DESC LIMIT ?,?';
    var param = [0, 100];
    return new Promise(resolve => {
        connection.query(sql, param, (err, result) => {
            if (err) {
                console.log(err.message);
                resolve();
            }
            resolve(result);
        });
    });
}

/*


SELECT * FROM acticle a
left join atmap m on a.id=m.a_id;

select a.id, a.title, group_concat(m.t_id separator ',') tags
from acticle a join atmap m
on a.id=m.a_id
group by a.id

 */

module.exports = {
    init,
    selectTags
}