import * as contactsServices from '../services/contactsServices.js';

import httpError from '../helpers/httpError.js';

import ctrlWrapper from '../decorators/ctrlWrapper.js';

export const getAllContacts = async (req, res) => {
  const data = await contactsServices.listContacts(req.user.id);

  res.json(data);
};

export const getOneContact = async (req, res) => {
  const {id} = req.params;
  const data = await contactsServices.getContactById(id, req.user.id);
  if (!data) {
    throw httpError(404, `Not found`);
  }
  res.json(data);
};

export const deleteContact = async (req, res) => {
  const {id} = req.params;
  const deletedContact = await contactsServices.removeContact(id, req.user.id);

  if (!deletedContact) {
    throw httpError(404, 'Not found');
  }

  res.status(200).json(deletedContact);
};

export async function createContact(req, res, next) {
  try {
    const {name, email, phone, favorite} = req.body;
    const newContact = await contactsServices.addContact(
      {name, email, phone, favorite},
      req.user.id
    );
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
}

export const updateContact = async (req, res) => {
  const {id} = req.params;
  const data = await contactsServices.updateContactById(
    id,
    req.body,
    req.user.id
  );

  if (!data) {
    throw httpError(404, `Not found`);
  }

  res.json(data);
};

export const updateFavorite = async (req, res) => {
  const {id} = req.params;
  const {favorite} = req.body;

  const updated = await contactsServices.updateStatusContact(
    id,
    {favorite},
    req.user.id
  );

  if (!updated) {
    throw httpError(404, 'Not found');
  }

  res.json(updated);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
