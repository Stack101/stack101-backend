const MAIN_DB = require('db/main');

exports.testGet = async (req, res) => {
  console.log('test route......');

  const result = await MAIN_DB.collection('test').findOne({ name: 'test' });

  const results = await MAIN_DB.collection('test')
    .find()
    .toArray();

  const msg = {
    result,
    results,
  };

  console.log(msg);
  if (result && results) {
    res.json({ ok: 1, msg });
  } else {
    res.status(404).json({ ok: 0, msg: "resource doesn't exists" });
  }
};

exports.testPost = async (req, res) => {
  const { test } = req.body;

  const doc = {
    name: 'test',
    test,
  };

  await MAIN_DB.collection('test').insertOne(doc);
  console.log(test);
  res.json({ ok: 1, msg: 'success' });
};
