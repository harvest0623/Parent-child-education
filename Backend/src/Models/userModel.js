const db = require('../Config/database.js');

// 根据手机号查询用户
async function findUserByPhone(phone) {
    const [rows] = await db.execute('SELECT * FROM users WHERE phone = ? LIMIT 1', [phone]);
    // console.log(rows);
    return rows[0];
}

// 创建用户
async function createUser({ phone, passwordHash, nickname }) {
    const [res] = await db.execute('INSERT INTO users (phone, password_hash, create_time, nickname, gender) VALUES (?, ?, NOW(), ?, 1)', [phone, passwordHash, nickname]);
    // console.log(res);
    if (res.affectedRows) {
        return {
            id: res.insertId,
            phone
        }
    }
}

module.exports = {
    findUserByPhone,
    createUser
}