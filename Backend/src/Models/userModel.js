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

// 根据用户ID查询用户信息
async function findUserById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0];
}

// 更新用户信息
async function updateUserInfo(params, id) {
    const allKeys = ['id', 'avatar', 'nickname', 'password_hash'];
    const currentKeys = Object.keys(params);  // ['avatar']
    currentKeys.forEach((item) => {
        if (!allKeys.includes(item)) {
            throw new Error('参数错误');
        }
    });
    const sql = currentKeys.map((item) => `${item} = ?`).join(', ');

    // 更新数据库
    const [res] = await db.execute(`UPDATE users SET ${sql} WHERE id = ?`, [...currentKeys.map((item) => params[item]), id]);
    // console.log(res);

    return res;
}

module.exports = {
    findUserByPhone,
    createUser,
    findUserById,
    updateUserInfo
}