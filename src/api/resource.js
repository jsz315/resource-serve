const Router = require('koa-router')
const router = new Router()
const multer = require('koa-multer')
const fs = require('fs')
const path = require('path')
const config = require('../core/config')
const {
    resource
} = require('../sql/index');

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

router.get("/resource/test", async (ctx, next) => {
    ctx.body = "resource test";
})


router.get("/resource/imgs", async (ctx, next) => {
    let res = await resource.selectImgs();
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