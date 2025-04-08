import Contact from '../db/models/contact.js';

export async function listContacts() {
  return Contact.findAll();
}

export async function getContactById(contactId) {
  return Contact.findByPk(contactId);
}

export async function removeContact(contactId) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  await contact.destroy();

  return contact;
}

export async function addContact({name, email, phone, favorite}) {
  return Contact.create({name, email, phone, favorite});
}

export async function updateContactById(contactId, data) {
  const contact = await getContactById(contactId);
  if (!contact) return null;

  return contact.update(data, {
    returning: true,
  });
}

export async function updateStatusContact(contactId, {favorite}) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  await contact.update({favorite});
  return contact;
}
