const Sequelize = require('sequelize');
const express = require("express");
const bodyParser = require("body-parser");
const {parse: parseUrl} = require("url");
const fetch = require("node-fetch");
const crypto = require("crypto");
const app = express();
app.use(bodyParser.json());

const toLowerCaseAndHyphenURIComponent = (string = "") =>
    `${encodeURIComponent(
        string
            .replace(/[;/?:@&=+$,# _\n]+/g, "-")
            .replace(/^(-*)/, "")
            .replace(/(-*)$/, "")
            .toLocaleLowerCase()
    )}`;

const config = {
    database: 'dmca',
    username: 'dmca',
    password: '123@dmca',
    host: '127.0.0.1',
    port: 3306
};
const sequelize = new Sequelize(config.database, config.username,   config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    },
});

const dmcaList = sequelize.define('dmca_list', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    bookId: Sequelize.BIGINT,
    infringingURLs: Sequelize.TEXT,
    originalURL: Sequelize.TEXT,
    isFinish: Sequelize.BOOLEAN,
    dateTime: Sequelize.DATE,
}, {
    timestamps: false,
    freezeTableName: true,
});


const qidianDmcaList = sequelize.define('qidian_dmca_list', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    bookId: Sequelize.BIGINT,
    infringingURLs: Sequelize.TEXT,
    originalURL: Sequelize.TEXT,
    isFinish: Sequelize.BOOLEAN,
    dateTime: Sequelize.DATE,
}, {
    timestamps: false,
    freezeTableName: true,
});

const crawlList = sequelize.define('crawl_list', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    bookId: Sequelize.BIGINT,
    allURLs: Sequelize.TEXT,
    infringingURLs: Sequelize.TEXT,
    dateTime: Sequelize.DATE,
}, {
    timestamps: false,
    freezeTableName: true,
});
const qidianCrawlList = sequelize.define('qidian_crawl_list', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    bookId: Sequelize.BIGINT,
    allURLs: Sequelize.TEXT,
    infringingURLs: Sequelize.TEXT,
    dateTime: Sequelize.DATE,
}, {
    timestamps: false,
    freezeTableName: true,
});

const bookAllInfringing = sequelize.define('book_all_infringing2023', {
    bookId: Sequelize.BIGINT,
    bookName: Sequelize.TEXT,
    infringingURLs: Sequelize.TEXT,
    originalURL: Sequelize.TEXT,
}, {
    timestamps: false,
    freezeTableName: true,
});

const qidianBookAllInfringing = sequelize.define('qidian_book_all_infringing', {
    bookId: Sequelize.BIGINT,
    bookName: Sequelize.TEXT,
    infringingURLs: Sequelize.TEXT,
    originalURL: Sequelize.TEXT,
}, {
    timestamps: false,
    freezeTableName: true,
});

const blacklist = sequelize.define('blacklist', {
    domain: Sequelize.TEXT,
    deprecated: Sequelize.TINYINT,
    note: Sequelize.TEXT,
}, {
    timestamps: false,
    freezeTableName: true,
});

const qidianBlacklist = sequelize.define('qidian_blacklist', {
    domain: Sequelize.TEXT,
    deprecated: Sequelize.TINYINT,
    note: Sequelize.TEXT,
}, {
    timestamps: false,
    freezeTableName: true,
});

// 获取所有的黑名单列表
app.get("/blacklist", async (req, res) => {
    // 获取所有的黑名单
    const domains = await blacklist.findAll({
        attributes:["domain", "deprecated", "note"]
    });
    res.json(domains);
});

app.post("/blacklist", async (req, res) => {});

app.post("/qidianDmcaList", async (req, res)  => {
    // 获取 blackList 列表
    const blackList = (await qidianBlacklist.findAll({
        attributes:["domain", "deprecated", "note"]
    })).filter((b) => !b.deprecated)

    const r = req.body;
    const hrefs = r.hrefs;
    const bookName = r.bookName;
    const authorName = r.authorName;
    const cbid = r.cbid;
    const results = [];
    console.log(r.hrefs);
    const notInBlackListResults = [];
    const notInBlackListResultsURLs = [];
    const notInBlackListResultsTitles = [];
    hrefs.forEach(({href: h, title}) => {
        const URL = parseUrl(h);
        let isPirate = false;
        blackList.forEach(({ domain })=> {
            // 获取 URL.hostname 的根域名
            if(URL.hostname.indexOf(domain) !== -1 && (URL.hostname.indexOf(domain) + domain.length === URL.hostname.length)) {
                isPirate = true;
            }
        })
        if(isPirate) {
            // 去重
            if (results.indexOf(h.split('#')[0]) === -1) {
                // 对于一些精选摘要会带 #, 我们把 # 号去掉
                results.push(h.split('#')[0]);
            }
        } else {
            notInBlackListResults.push(URL.hostname);
            notInBlackListResultsURLs.push(h);
            notInBlackListResultsTitles.push(title);
        }
    });

    r.allURLs = hrefs.map(({href}) => href).join('\n');
    r.infringingURLs = results.join('\n');
    // 多少个盗版网站的 URL
    r.totalNum = results.length;

    console.log(`r.infringingURLs ${r.infringingURLs}`);

    if (r.infringingURLs !== '') {
        await sequelize.transaction(async t => {
            await qidianCrawlList.create({
                bookId: r.bookId,
                bookName: r.bookName,
                allURLs: r.allURLs,
                infringingURLs: r.infringingURLs,
                dateTime: new Date(),
            }, { fields: ['bookId', 'bookName', 'allURLs', 'infringingURLs', 'dateTime'], transaction: t});

            // 判断该 bookId 在 bookAllInfringing 中是否存在，如果不存在的话，直接插入 bookAllInfringing 和 dmcaList
            // 如果存在的话，取出来，取 infringingURLs 去重放入
            const book = await qidianBookAllInfringing.findOne({where: {bookId: r.bookId}, transaction: t, attributes: ['infringingURLs']});
            if(book === null) {
                console.log('not exist, inserting');
                // 说明之前没有爬过这本书，将这本书的信息插入 bookAllInfringing && dmcaList
                await qidianBookAllInfringing.create({
                    infringingURLs: r.infringingURLs,
                    bookName: r.bookName,
                    bookId: r.bookId,
                    originalURL: `https://book.qidian.com/info/${r.bookId}/`,
                }, { fields: ['infringingURLs', 'bookName', 'bookId', 'originalURL'], transaction: t});

                const dmcaInstance = await qidianDmcaList.create({
                    bookId: r.bookId,
                    infringingURLs: r.infringingURLs,
                    originalURL: `https://book.qidian.com/info/${r.bookId}/`,
                    isFinish: false,
                    dateTime: new Date(),
                }, { fields: ['bookId', 'infringingURLs', 'originalURL', 'isFinish', 'dateTime'], transaction: t});

            } else {
                console.log('exist, modifying');
                const { infringingURLs: preInfringingURLs } = book;
                let preURLs = preInfringingURLs.split('\n');
                let newURLs = r.infringingURLs.split('\n');
                let xorURLs = [];

                // 查看 newURLs 有哪些在 preURLs 当中没有出现过
                newURLs.forEach(url => {
                    if(preURLs.indexOf(url) === -1) {
                        console.log(`url ${url} not exist, adding`);
                        xorURLs.push(url);
                    }
                });

                console.log(`preURLs ${JSON.stringify(preURLs)}`);
                console.log(`newURLs ${JSON.stringify(newURLs)}`);
                console.log(`xorURLs ${JSON.stringify(xorURLs)}`);

                if (xorURLs.length > 0) {
                    preURLs = preURLs.concat(xorURLs);
                    // 将新的 preURLs 更新进去
                    await qidianBookAllInfringing.update({
                        infringingURLs: preURLs.join('\n'),
                    }, {
                        where: {
                            bookId: r.bookId
                        },
                        transaction: t,
                    });

                    // 插入一条新的 dmca list
                    await qidianDmcaList.create({
                        bookId: r.bookId,
                        infringingURLs: xorURLs.join('\n'),
                        isFinish: false,
                        originalURL: `https://book.qidian.com/info/${r.bookId}/`,
                        dateTime: new Date(),
                    }, {fields: ['bookId', 'infringingURLs', 'isFinish', 'originalURL', 'dateTime'], transaction: t});
                }
            }
        });
    }
    res.json({ code: 0 });

    // 处理 notInBlackListResults 数组
    for (let i = 0, len = notInBlackListResults.length; i < len; i++) {
        const singleHostname = notInBlackListResults[i];
        const h = notInBlackListResultsURLs[i];
        const title = notInBlackListResultsTitles[i];
        const blackListInstance = await qidianBlacklist.findOne({where: {domain: singleHostname}, attributes: ['domain', 'deprecated']});
        // 如果没有这个 hostname 的数据，则插入一个
        if (blackListInstance === null) {

            try {
                const ts = Date.now();
                const secretKey = 'kk%9$k6d@z';
                const url = `https://openapi-watchman.yuewen.com/api/url/checkIsPirated?webUrl=${encodeURIComponent(h)}&bookName=${encodeURIComponent(bookName)}&title=${encodeURIComponent(title)}&authorName=${encodeURIComponent(authorName)}&cbid=${encodeURIComponent(cbid)}&timestamp=${ts}&sign=${crypto.createHash('md5').update(`${secretKey}${h}${bookName}${title}${authorName}${cbid}${ts}`).digest("hex")}`;
                console.log(url);
                const f = await fetch(url);
                /*
                返回码：  2： 是盗版链接,
                1： 暂不确定是否是盗版链接
                0： 非盗版链接
                -1： 错误链接，提取域名失败
                -2, 请求处理异常请重试
                 */
                const { code, message } = await f.json();
                console.log(`${code} ${message} ${h}`);
                // 插入一个新的项
                // 盗版链接
                if (code == 2) {
                    // 将这个 hostname 的 deprecated 设置为 1
                    await qidianBlacklist.create({
                        domain: singleHostname,
                        deprecated: 0
                    }, { fields: ["domain", "deprecated"] });
                } else if (code == 0) {
                    // 非盗版链接
                    await qidianBlacklist.create({
                        domain: singleHostname,
                        deprecated: 1
                    }, { fields: ["domain", "deprecated"] });
                }
            } catch (e) {}
        } else {
            // 如果 deprecated === 2, 则请求后端确认是否是盗版网站
            if (blackListInstance.deprecated === 2) {
                try {
                    const ts = Date.now();
                    const secretKey = 'kk%9$k6d@z';
                    const url = `https://openapi-watchman.yuewen.com/api/url/checkIsPirated?webUrl=${encodeURIComponent(h)}&bookName=${encodeURIComponent(bookName)}&title=${encodeURIComponent(title)}&authorName=${encodeURIComponent(authorName)}&cbid=${encodeURIComponent(cbid)}&timestamp=${ts}&sign=${crypto.createHash('md5').update(`${secretKey}${h}${bookName}${title}${authorName}${cbid}${ts}`).digest("hex")}`;
                    console.log(url);
                    const f = await fetch(url);
                    /*
                    返回码：  2： 是盗版链接,
                    1： 暂不确定是否是盗版链接
                    0： 非盗版链接
                    -1： 错误链接，提取域名失败
                    -2, 请求处理异常请重试
                     */
                    const { code, message } = await f.json();
                    console.log(`${code} ${message} ${h}`);
                    // 盗版链接
                    if (code == 2) {
                        // 将这个 hostname 的 deprecated 设置为 1
                        await qidianBlacklist.update({
                            deprecated: 0
                        }, {
                            where: {
                                domain: singleHostname
                            }
                        });
                    } else if (code == 0) {
                        // 非盗版链接
                        await qidianBlacklist.update({
                            deprecated: 1
                        }, {
                            where: {
                                domain: singleHostname
                            }
                        });

                    }
                } catch (e) {
                }
            }
        }
    }
});

app.post("/dmcaList", async (req, res)  => {
    // 获取 blackList 列表
    const blackList = (await blacklist.findAll({
        attributes:["domain", "deprecated", "note"]
    })).filter((b) => !b.deprecated)

    const r = req.body;
    const hrefs = r.hrefs;
    const results = [];
    console.log(r.hrefs);
    const notInBlackListResults = [];
    const notInBlackListResultsURLs = [];
    hrefs.forEach(h => {
        const URL = parseUrl(h);
        let isPirate = false;
        blackList.forEach(({ domain })=> {
            // 获取 URL.hostname 的根域名
            if(URL.hostname.indexOf(domain) !== -1 && (URL.hostname.indexOf(domain) + domain.length === URL.hostname.length)) {
                isPirate = true;
            }
        })
        if(isPirate) {
            // 去重
            if (results.indexOf(h.split('#')[0]) === -1) {
                // 对于一些精选摘要会带 #, 我们把 # 号去掉
                results.push(h.split('#')[0]);
            }
        } else {
            notInBlackListResults.push(URL.hostname);
            notInBlackListResultsURLs.push(h);
        }
    });

    r.allURLs = hrefs.join('\n');
    r.infringingURLs = results.join('\n');
    // 多少个盗版网站的 URL
    r.totalNum = results.length;

    console.log(`r.infringingURLs ${r.infringingURLs}`);

    if (r.infringingURLs !== '') {
        await sequelize.transaction(async t => {
            await crawlList.create({
                bookId: r.bookId,
                bookName: r.bookName,
                allURLs: r.allURLs,
                infringingURLs: r.infringingURLs,
                dateTime: new Date(),
            }, { fields: ['bookId', 'bookName', 'allURLs', 'infringingURLs', 'dateTime'], transaction: t});

            // 判断该 bookId 在 bookAllInfringing 中是否存在，如果不存在的话，直接插入 bookAllInfringing 和 dmcaList
            // 如果存在的话，取出来，取 infringingURLs 去重放入
            const book = await bookAllInfringing.findOne({where: {bookId: r.bookId}, transaction: t, attributes: ['infringingURLs']});
            if(book === null) {
                console.log('not exist, inserting');
                // 说明之前没有爬过这本书，将这本书的信息插入 bookAllInfringing && dmcaList
                await bookAllInfringing.create({
                    infringingURLs: r.infringingURLs,
                    bookName: r.bookName,
                    bookId: r.bookId,
                    originalURL: `${r.isWebsite ? `https://www.webnovel.com`: `https://www.webnovel.com/${r.isComic ? "comic" : "book"}/${toLowerCaseAndHyphenURIComponent(r.bookName)}_${r.bookId}`}`,
                }, { fields: ['infringingURLs', 'bookName', 'bookId', 'originalURL'], transaction: t});

                const dmcaInstance = await dmcaList.create({
                    bookId: r.bookId,
                    infringingURLs: r.infringingURLs,
                    originalURL: `${r.isWebsite ? `https://www.webnovel.com`: `https://www.webnovel.com/${r.isComic ? "comic" : "book"}/${toLowerCaseAndHyphenURIComponent(r.bookName)}_${r.bookId}`}`,
                    isFinish: false,
                    dateTime: new Date(),
                }, { fields: ['bookId', 'infringingURLs', 'originalURL', 'isFinish', 'dateTime'], transaction: t});

            } else {
                console.log('exist, modifying');
                const { infringingURLs: preInfringingURLs } = book;
                let preURLs = preInfringingURLs.split('\n');
                let newURLs = r.infringingURLs.split('\n');
                let xorURLs = [];

                // 查看 newURLs 有哪些在 preURLs 当中没有出现过
                newURLs.forEach(url => {
                    if(preURLs.indexOf(url) === -1) {
                        console.log(`url ${url} not exist, adding`);
                        xorURLs.push(url);
                    }
                });

                console.log(`preURLs ${JSON.stringify(preURLs)}`);
                console.log(`newURLs ${JSON.stringify(newURLs)}`);
                console.log(`xorURLs ${JSON.stringify(xorURLs)}`);

                if (xorURLs.length > 0) {
                    preURLs = preURLs.concat(xorURLs);
                    // 将新的 preURLs 更新进去
                    await bookAllInfringing.update({
                        infringingURLs: preURLs.join('\n'),
                    }, {
                        where: {
                            bookId: r.bookId
                        },
                        transaction: t,
                    });

                    // 插入一条新的 dmca list
                    await dmcaList.create({
                        bookId: r.bookId,
                        infringingURLs: xorURLs.join('\n'),
                        isFinish: false,
                        originalURL: `${r.isWebsite ? `https://www.webnovel.com`: `https://www.webnovel.com/${r.isComic ? "comic" : "book"}/${toLowerCaseAndHyphenURIComponent(r.bookName)}_${r.bookId}`}`,
                        dateTime: new Date(),
                    }, {fields: ['bookId', 'infringingURLs', 'isFinish', 'originalURL', 'dateTime'], transaction: t});
                }
            }
        });
    }
    res.json({ code: 0 });

    // 处理 notInBlackListResults 数组
    for (let i = 0, len = notInBlackListResults.length; i < len; i++) {
        const singleHostname = notInBlackListResults[i];
        const blackListInstance = await blacklist.findOne({where: {domain: singleHostname}, attributes: ['domain']});
        // 如果没有这个 hostname 的数据，则插入一个
        if (blackListInstance === null) {
            // 插入一个新的项
            await blacklist.create({
                domain: singleHostname,
                deprecated: 2 // wait for domain rating
            }, { fields: ["domain", "deprecated"] });
        }
    }
});

app.listen(80);