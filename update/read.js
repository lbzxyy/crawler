/**
 * 此文件是用来读取远程接口的数据
 */

 const request = require('request-promise')
 const cheerio = require('cheerio')
 exports.tags = async function(url) {
    let options = {
        url,
        transform(body) {
            return cheerio.load(body) // 转化成Jquery对象 $
        }
    }
    return request(options).then($=>{
        let infos = $('.item .tag .info-box')
        let tags = []
        infos.each(( index, info ) => {
            let tagInfo = $(info)
            let href = tagInfo.children().first().attr('href')
            let image = tagInfo.find('div.thumb').first().data('src')
            let title = tagInfo.find('div.title').first().text()
            let subscribe = tagInfo.find('div.subscribe').first().text()
            let article = tagInfo.find('div.article').first().text()
            tags.push({
                href: `https://juejin.im${href}`,
                image,
                title,
                subscribe: Number(subscribe.match(/^(\d+)/)[1]),
                article: Number(article.match(/^(\d+)/)[1])
            })
        })
        return tags

    })
 }
//  let taguUrl = 'https://juejin.im/subscribe/all'

//  exports.tags( taguUrl ).then( tags => {
//      console.log(tagUrl);
     
//  })
 


exports.articleList = async function(url){
    let options = {
        url,
        transform(body) {
            return cheerio.load(body) // 转化成Jquery对象 $
        }
    }
    return request(options).then(async $ => {
        let articleTitles = $('.content-box .info-box .title-row .title')
        let articles = []
        // 在foreach里 ecah里 是不能使用await 方法的 for of可以 普通for循环也可以
        for (let index = 0; index < articleTitles.length; index++) {
            const article = $(articleTitles[index]);
            let href = article.attr('href')
            let title = article.text()
            let id = href.slice(6)
            href = `https://juejin.im${href}`
            let detail = await articleDetail(href)
            articles.push({
                href,
                title,
                id,
                content: detail.content,
                tags: detail.tags
            })
        }
        
        return articles
    })
}

// let articleUrl = 'https://juejin.im/tag/%E5%89%8D%E7%AB%AF'

// exports.articleList(articleUrl).then( articles => {
//     console.log(articles);
// })


async function articleDetail(url) {
    let options = {
        url,
        transform(body){
            return cheerio.load(body)
        }
    }
    return request(options).then($=> {
        let content = $('.article-content').first().text()
        let tagTitles = $('.tag-list .item .tag-title')
        let tags = []
        tagTitles.each((index, title) => {
            tags.push($(title).text())
        })
        return {
            tags,
            content
        }
    })
}
 
// let articleDetailUrl = 'https://juejin.im/post/5cb7d6def265da03576ebd6f'
// exports.articleDetail(articleDetailUrl).then( article => {
//     console.log(article);
    
// })

