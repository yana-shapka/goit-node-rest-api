import Contact from '../db/models/contact.js';

export async function listContacts(userId) {
  return Contact.findAll({
    where: {
      owner: userId, 
    },
  });
}

export async function getContactById(contactId, userId) {
  return Contact.findOne({
    where: {
      id: contactId,
      owner: userId,
    },
  });
}

export async function removeContact(contactId, userId) {
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner: userId,
    },
  });
  if (!contact) return null;

  await contact.destroy();
  return contact;
}

export async function addContact({ name, email, phone, favorite }, userId) {
  return Contact.create({ name, email, phone, favorite, owner: userId });
}

export async function updateContactById(contactId, data, userId) {
  const contact = await getContactById(contactId, userId);
  if (!contact) return null;

  return contact.update(data, {
    returning: true,
  });
}

export async function updateStatusContact(contactId, { favorite }, userId) {
  const contact = await getContactById(contactId, userId);
  if (!contact) return null;

  await contact.update({ favorite });
  return contact;
}
