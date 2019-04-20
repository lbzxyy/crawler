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

// 此方法用于文章 将文章保存到mysql数据库中去
exports.articles = async function (articles) {
    for (const article of articles) {
        let oldArticles = await query(`SELECT * FROM articles WHERE id=?`,[article.id])
        if(Array.isArray(oldArticles) && oldArticles.length>0) {
            await query(`UPDATE articles SET title=?, content=?, href=? WHERE id=?`,[
                article.title,article.content,article.href,article.id
            ])
        }else{
            await query(`INSERT INTO articles (id,title,content,href) VALUES(?,?,?,?)`,[
                article.id,article.title,article.content,article.href
            ])
        }
        // 处理我们文章和标签的关系 先全部删除此文章所有标签 然后再插入
        await query(`DELETE FROM article_tag WHERE article_id=?`,[article.id])
        // 查询一下此文章的对应标签的ID数组
        let tagWhere = "'" + article.tags.join(" ',' ") + "'"
        let tagIds = await query(`SELECT id FROM tags WHERE name IN (${tagWhere})`)
        for(tagId of tagIds) {
            await query(`INSERT INTO article_tag (tag_id,article_id) VALUES(?,?)`,[
                tagId.id,article.id
            ])
        }
    }
}

// exports.tags([
//     {
//         title: 'title1',
//         image: 'image111',
//         subscribe: 111,
//         article: 111
//     },
//     {
//         title: 'title2',
//         image: 'image222',
//         subscribe: 222,
//         article: 222
//     }
// ])

exports.articles([
    {id:'id1',title: 'title11111',content: 'content11111',href: 'href11111',tags: ['title1']},
    {id:'id2',title: 'title22222',content: 'content22222',href: 'href888888',tags: ['title2']}
])

















