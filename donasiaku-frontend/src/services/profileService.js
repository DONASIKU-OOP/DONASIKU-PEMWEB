import { getAuthData, setAuthData } from '../utils/localStorage';

const USERS_KEY = 'users_db';

const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const updateProfile = async (userId, updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        reject(new Error('User tidak ditemukan'));
        return;
      }

      if (updatedData.email && updatedData.email !== users[userIndex].email) {
        const emailExists = users.some(u => u.email === updatedData.email && u.id !== userId);
        if (emailExists) {
          reject(new Error('Email sudah digunakan oleh user lain'));
          return;
        }
      }

      users[userIndex] = {
        ...users[userIndex],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };

      saveUsers(users);

      const { password, ...userWithoutPassword } = users[userIndex];
      setAuthData(userWithoutPassword);
      
      resolve(userWithoutPassword);
    }, 500);
  });
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        reject(new Error('User tidak ditemukan'));
        return;
      }

      if (users[userIndex].password !== currentPassword) {
        reject(new Error('Password lama tidak sesuai'));
        return;
      }

      users[userIndex].password = newPassword;
      users[userIndex].updatedAt = new Date().toISOString();

      saveUsers(users);
      resolve({ success: true });
    }, 500);
  });
};

export const getProfileStats = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const donasi = JSON.parse(localStorage.getItem('donasi') || '[]');
      const userDonasi = donasi.filter(d => d.userId === userId);

      const stats = {
        totalDonasi: userDonasi.length,
        donasiAktif: userDonasi.filter(d => d.status === 'aktif').length,
        donasiSelesai: userDonasi.filter(d => d.status === 'selesai').length,
        totalBarang: userDonasi.reduce((sum, d) => sum + (d.jumlah || 0), 0),
        joinDate: getAuthData()?.createdAt || new Date().toISOString()
      };

      resolve(stats);
    }, 300);
  });
};

export const updateProfilePhoto = async (userId, photoBase64) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        reject(new Error('User tidak ditemukan'));
        return;
      }

      users[userIndex].profilePhoto = photoBase64;
      users[userIndex].updatedAt = new Date().toISOString();

      saveUsers(users);

      const { password, ...userWithoutPassword } = users[userIndex];
      setAuthData(userWithoutPassword);
      
      resolve(userWithoutPassword);
    }, 500);
  });
};

export const deleteProfilePhoto = async (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        reject(new Error('User tidak ditemukan'));
        return;
      }

      delete users[userIndex].profilePhoto;
      users[userIndex].updatedAt = new Date().toISOString();

      saveUsers(users);

      const { password, ...userWithoutPassword } = users[userIndex];
      setAuthData(userWithoutPassword);
      
      resolve(userWithoutPassword);
    }, 300);
  });
};