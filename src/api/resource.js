const Router = require('koa-router')
const router = new Router()
const multer = require('koa-multer')
const fs = require('fs')
const path = require('path')
const config = require('../core/config')
const {resource} = require('../sql/index');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/upload/')
    },
    filename: function (req, file, cb) {
        const ext = (file.originalname).split(".").pop();
        cb(null, Date.now() + "." + ext);
    }
})

var upload = multer({
    storage: storage
});

router.post('/resource/add', upload.single('file'), async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    var res = await resource.add({
        name: ctx.req.file.filename,
        desc: ctx.req.body.desc,
        tags: ctx.req.body.tags
    })
    ctx.body = {
        filename: ctx.req.file.filename,
        req: {
            ...ctx.req.body
        },
        res: res
    }
})

router.post('/resource/edit', upload.single('file'), async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    var param = {
        id: ctx.req.body.id,
        desc: ctx.req.body.desc,
        tags: ctx.req.body.tags
    }
    if(ctx.req.file){
        param.name = ctx.req.file.filename;
        config.deleteImg(ctx.req.body.old);
    }

    var res = await resource.edit(param);
    ctx.body = {
        req: {
            ...ctx.req.body
        },
        res: res
    }
})

router.post("/resource/delete", upload.single('file'), async (ctx, next) => {
    // var list = ctx.req.body.list;
    ctx.set('Access-Control-Allow-Origin', '*');
    console.log(ctx.req.body);
    var list = JSON.parse(ctx.req.body.list);
    list.forEach(item => {
        config.deleteImg(item.name);
    });
    for(var i = 0; i < list.length; i++){
        var item = list[i];
        await resource.deleteImg(item.id);
        await resource.deleteTags(item.id);
    }
    ctx.body = {
        req: "success"
    }
})

router.get("/resource/test", async (ctx, next) => {
    ctx.body = "resource test";
})

router.get("/resource/addTag", async (ctx, next) => {
    var tag = ctx.request.query.tag;
    console.log(tag);
    resource.addTag(tag);
    ctx.body = "success";
})

router.get("/resource/search", async (ctx, next) => {
    var {name, isTag, isDesc} = ctx.request.query;
    var res = await resource.search(name, isTag == 'true', isDesc == 'true');
    if (res) {
        ctx.body = JSON.stringify({
            data: res,
            error: false
        });
    } else {
        ctx.body = JSON.stringify({
            error: true
        });
    }
})



router.get("/resource/imgs", async (ctx, next) => {
    var {page, size} = ctx.request.query;
    page = Number(page);
    size = Number(size);
    let res = await resource.selectImgs(page * size, size);
    if (res) {
        ctx.body = JSON.stringify({
            data: res,
            error: false
        });
    } else {
        ctx.body = JSON.stringify({
            error: true
        });
    }
})

router.get("/resource/tags", async (ctx, next) => {
    let res = await resource.selectTags();
    if (res) {
        ctx.body = JSON.stringify({
            data: res,
            error: false
        });
    } else {
        ctx.body = JSON.stringify({
            error: true
        });
    }
})

router.post("/yun/data/filter", async (ctx, next) => {
    let params = ctx.request.body;
    saveFilter(params.content);
    core.filterData = params.content;
    ctx.body = "success";
})

module.exports = router