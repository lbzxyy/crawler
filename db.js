const mysql = require('mysql')
// 把传人到回调转化成 promise对象
const promise = require('bluebird')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jiagou'
}) // 创建链接

module.exports = {
    query: promise.promisify(connection.query).bind(connection) 
}
