const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('contacts').find();
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts);
    }).catch((err) => {
        res.status(500).json({ message: 'Failed to retrieve contacts.', error: err });
    });
};

const getSingle = async (req, res) => {
    const userId = new objectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('contacts').find({ _id: userId });
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts[0]);
    }).catch((err) => {
        res.status(500).json({ message: 'Failed to retrieve contact.', error: err });
    });
};

module.exports = {
    getAll,
    getSingle
};