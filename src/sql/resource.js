let connection;

const init = function (c) {
    connection = c;
}

const selectTags = function () {
    var sql = 'SELECT * FROM `asset`.`lib_tag` ORDER BY `id` DESC LIMIT ?, ?';
    var param = [0, 100];
    return new Promise(resolve => {
        connection.query(sql, param, (err, result) => {
            if (err) {
                // console.log(err.message);
                resolve();
            }
            resolve(result);
        });
    });
}

const selectImgs = async function(){
    var sql = `
            select a.id, a.name, a.desc, a.timer, group_concat(m.tag_id separator ',') tags
            from lib_image a join map_image_tag m
            on a.id=m.img_id
            group by a.id
        `;
    var res = await doSql(sql, []);
    return res;
}

const add = async function (obj) {
    var sql = 'INSERT INTO `asset`.`lib_image`(`name`, `desc`, `timer`) VALUES(?, ?, now())';
    console.log(sql);
    var param = [
        obj.name,
        obj.desc
    ]
    var res = await doSql(sql, param);
    if(res){
        res = await setTags(res.insertId, obj.tags);
    }
    return res;
}

const edit = async function (obj){
    var res = await deleteTags(obj.id);
    if(res){
        await setTags(obj.id, obj.tags);
    }
    var sql, param;
    if(obj.name){
        sql = 'UPDATE `asset`.`lib_image` SET `name` = ?, `desc` = ? WHERE `id` = ?';
        param = [obj.name, obj.desc, obj.id];
    }
    else{
        sql = 'UPDATE `asset`.`lib_image` SET `desc` = ? WHERE `id` = ?';
        param = [obj.desc, obj.id];
    }
    console.log(sql);
    console.log(param);
    return doSql(sql, param);
}

function deleteImg(id){
    var sql = 'DELETE FROM `asset`.`lib_image` WHERE `id` = ?';
    var param = [id];
    return doSql(sql, param);
}

function deleteTags(id){
    var sql = 'DELETE FROM `asset`.`map_image_tag` WHERE `img_id` = ?';
    var param = [id];
    return doSql(sql, param);
}

function setTags(id, tagstr){
    var tags = tagstr.split(",");
    var keyValues = tags.map(element => '(?, ?)');
    var sql = 'INSERT INTO `asset`.`map_image_tag`(`img_id`, `tag_id`) VALUES' + keyValues.join(",");
    var param = [];
    tags.forEach(element => {
        param.push(id);
        param.push(element)
    });
    return doSql(sql, param);
}

function doSql(sql, param) {
    return new Promise(resolve => {
        connection.query(sql, param, (err, result) => {
            if (err) {
                console.log(err.message);
                resolve(false);
                return;
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
    selectTags,
    selectImgs,
    add,
    edit,
    deleteImg
}