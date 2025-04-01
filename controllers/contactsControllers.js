import * as contactsServices from '../services/contactsServices.js';

import httpError from '../helpers/httpError.js';

const ctrlWrapper = ctrl => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return func;
};

export const getAllContacts = async (req, res) => {
  const data = await contactsServices.listContacts();

  res.json(data);
};

export const getOneContact = async (req, res) => {
  const {id} = req.params;
  const data = await contactsServices.getContactById(id);
  if (!data) {
    throw httpError(404, `Not found`);
  }
  res.json(data);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await contactsServices.removeContact(id);

  if (!deletedContact) {
    throw httpError(404, "Not found");
  }

  res.status(200).json(deletedContact);
};
export const createContact = async (req, res) => {
  const newContact = await contactsServices.addContact(req.body);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const {id} = req.params;
  const data = await contactsServices.updateContactById(id, req.body);

  if (!data) {
    throw httpError(404, `Not found`);
  }

  res.json(data);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
