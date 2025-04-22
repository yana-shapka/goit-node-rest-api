import path from 'path';

const avatarsDir = path.resolve('public', 'avatars');

export function generateAvatarFilePath(email) {
  const fileName = `${Date.now()}-${email.replace(/[@.]/g, '_')}.jpg`;
  const filePath = path.join(avatarsDir, fileName);
  return { fileName, filePath };
}