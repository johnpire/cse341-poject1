const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const result = await mongodb.getDatabase().db().collection('contacts').find();
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts);
        }).catch((err) => {
        res.status(500).json({ message: 'Failed to retrieve contacts.', error: err });
    });
};

const getSingle = async (req, res) => {
    // validator
    if (!objectId.isValid(req.params.id)) {
        res.status(400).json('Invalid contact ID format');
        return;
    }

    //#swagger.tags = ['Contacts']
    const userId = new objectId(req.params.id);

    const result = await mongodb.getDatabase().db().collection('contacts').find({ _id: userId });
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts[0]);
    }).catch((err) => { 
        res.status(500).json({ message: 'Failed to retrieve contact.', error: err });
    });    
};

const createContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    }
    const result = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);
    if (result.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(result.error || 'Some error occurred while creating the contact.');
    }
};

const updateContact = async (req, res) => {
    // validator
    if (!objectId.isValid(req.params.id)) {
        res.status(400).json('Invalid contact ID format');
        return;
    }   

    //#swagger.tags = ['Contacts']
    const userId = new objectId(req.params.id);
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    }
    const result = await mongodb.getDatabase().db().collection('contacts').replaceOne({ _id: userId }, contact);
    if (result.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(result.error || 'Some error occurred while creating the contact.');
    }
};

const deleteContact = async (req, res) => {
    // validator
    if (!objectId.isValid(req.params.id)) {
        res.status(400).json('Invalid contact ID format');
        return;
    }

    //#swagger.tags = ['Contacts']
    const userId = new objectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('contacts').deleteOne({ _id: userId });
    if (result.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(result.error || 'Some error occurred while deleting the contact.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};  