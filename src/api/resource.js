const Router = require('koa-router')
const router = new Router()
const multer = require('koa-multer')
const fs = require('fs')
const path = require('path')
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

router.post('/yun/upload', upload.single('file'), async (ctx, next) => {
    console.log('/yun/upload');
    console.log({...ctx.req.body});
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.body = {
        filename: ctx.req.file.filename
    }
})

router.get("/resource/test", async (ctx, next) => {
  ctx.body = "resource test";
})

router.get("/resource/tags", async (ctx, next) => {
    let res = await resource.selectTags();
    if(res){
        ctx.body = JSON.stringify({data: res, error: false});
    }
    else{
        ctx.body = JSON.stringify({error: true});
    }
  })

router.post("/yun/data/filter", async (ctx, next) => {
  let params = ctx.request.body;
  saveFilter(params.content);
  core.filterData = params.content;
  ctx.body = "success";
})	

module.exports = router