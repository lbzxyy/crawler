const { query } = require('../db')

// 此方法用于 将标签保持到mysql数据库中去
exports.tags = async function(tags) {
    for ( tag of tags) {
      let oldTags =  await query(`SELECT * FROM tags WHERE name=?`,[tag.title])
      console.log(oldTags);
       
      if(Array.isArray(oldTags) && oldTags.length>0) {
        //   查询到数据 则应该是更新数据

        await query(`UPDATE tags SET image=?, subscribe=?, article=? WHERE id=?`,[
            tag.image,tag.subscribe,tag.article,oldTags[0].id
        ])
      }else{
          // 插入数据
         await query(`INSERT INTO tags (name,image,subscribe,article) VALUES(?,?,?,?)`,[
             tag.title,tag.image,tag.subscribe,tag.article
         ])
      }
    }
}

exports.tags([
    {
        title: 'title1',
        image: 'image111',
        subscribe: 111,
        article: 111
    },
    {
        title: 'title2',
        image: 'image222',
        subscribe: 222,
        article: 222
    }
])