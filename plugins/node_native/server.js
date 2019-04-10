const db = require('./libs/database');
const { addRouter } = require('./libs/router');
const http = require('./libs/http');

addRouter('GET', '/list', async (res, get, post, file) => {
    try {
        let data = await db.query('SELECT * FROM shop_table');
        res.writeJson({ error: 0, data });
    } catch (e) {
        res.writeJson({ error: 1, msg: 'database error:' + e });
    }
    res.end();
});