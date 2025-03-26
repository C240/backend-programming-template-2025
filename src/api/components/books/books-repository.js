const { Books } = require('../../../models');

async function getBooks(offset = 0, limit = 10) {
  const total = await Books.countDocuments({});
  const books = await Books.find({}).skip(offset).limit(limit);

  return {
    total,
    books,
    offset,
    limit,
  };
}

async function create(title) {
  return Books.create({ title });
}

module.exports = {
  getBooks,
  create,
};
