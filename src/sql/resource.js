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

const selectImgs = async function(start, size){
    var sql = `
            select a.id, a.name, a.desc, a.timer, group_concat(m.tag_id separator ',') tags
            from lib_image a join map_image_tag m
            on a.id=m.img_id
            group by a.id
            order by a.id desc
            limit ?, ?;
        `;
    var list = await doSql(sql, [start, size]);
    sql = `
        SELECT count(distinct(a.id)) tl
        FROM lib_image a join map_image_tag m 
        on a.id=m.img_id;
    `;
    var total = await doSql(sql);
    return {
        list,
        total
    };
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

function addTag(tag){
    var sql = 'INSERT INTO `asset`.`lib_tag`(`name`) VALUES(?)';
    var param = [tag];
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

function search(name, isTag, isDesc){
    var sql;
    console.log("name, isTag, isDesc")
    console.log(name, isTag, isDesc)
    console.log(typeof name, typeof isTag, typeof isDesc)
    if(isTag && isDesc){
        sql = `
        select i.id, i.name, i.timer, i.desc, group_concat(m.tag_id separator ",") tags 
        from asset.lib_tag t, asset.map_image_tag m, asset.lib_image i 
        where t.id=m.tag_id and m.img_id=i.id 
        and (t.name like "%${name}%" or i.desc like "%${name}%") 
        group by i.id
        order by i.id desc;
        `;
    }
    else{
        if(isTag){
            sql = `
            select i.id, i.name, i.timer, i.desc, group_concat(m.tag_id separator ",") tags 
            from asset.lib_tag t, asset.map_image_tag m, asset.lib_image i 
            where t.id=m.tag_id and m.img_id=i.id and t.name like "%${name}%" 
            group by i.id
            order by i.id desc;
            `;
        }
        if(isDesc){
            // sql = 'SELECT * FROM asset.lib_image where `desc` like "%' + name + '%";';
            sql = `
            select a.id, a.name, a.desc, a.timer, group_concat(m.tag_id separator ',') tags
            from lib_image a join map_image_tag m
            on a.id=m.img_id
            where a.desc like "%${name}%"
            group by a.id
            order by a.id desc;
            `;
        }
    }
    return doSql(sql, []);
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

SELECT * FROM asset.map_image_tag m, lib_image l where m.img_id = l.id and m.tag_id = 4;

-- 描述 
select * from lib_image where `desc` like "%人%";
-- 标签
select * from lib_tag t, asset.map_image_tag m, lib_image i where t.id=m.tag_id and m.img_id=i.id
and t.name like "%人%";
-- 标签加描述
select * from lib_tag t,asset.map_image_tag m,lib_image i where t.id=m.tag_id and m.img_id=i.id
and ( t.`name` like "%人%" or i.`desc` like "%人%");

 */

module.exports = {
    init,
    selectTags,
    selectImgs,
    add,
    edit,
    deleteImg,
    deleteTags,
    addTag,
    search
}