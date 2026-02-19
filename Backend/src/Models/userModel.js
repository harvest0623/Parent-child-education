const db = require('../Config/database.js');

async function findUserByPhone(phone) {
    const [rows] = await db.execute('SELECT * FROM users WHERE phone = ? LIMIT 1', [phone]);
    // console.log(rows);
    return rows[0];
}

module.exports = {
    findUserByPhone
}