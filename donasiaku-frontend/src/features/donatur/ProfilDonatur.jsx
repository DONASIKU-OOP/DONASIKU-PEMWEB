import { useState, useEffect } from 'react';
import { 
  FiUser, FiMail, FiLock, FiCamera, FiEdit2, FiSave, 
  FiX, FiPackage, FiClock, FiCheckCircle, FiCalendar,
  FiAlertCircle, FiEye, FiEyeOff, FiTrash2
} from 'react-icons/fi';
import { getAuthData } from '../../utils/localStorage';
import { 
  updateProfile, 
  changePassword, 
  getProfileStats,
  updateProfilePhoto,
  deleteProfilePhoto
} from '../../services/profileService';
import { validateEmail, validatePassword } from '../../utils/validation';

const ProfilDonatur = () => {
  const currentUser = getAuthData();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    bio: currentUser?.bio || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [photoPreview, setPhotoPreview] = useState(currentUser?.profilePhoto || null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getProfileStats(currentUser.id);
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Ukuran foto maksimal 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        setPhotoPreview(reader.result);
        try {
          await updateProfilePhoto(currentUser.id, reader.result);
          setSuccessMessage('Foto profil berhasil diupdate');
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
          setErrorMessage(error.message);
          setTimeout(() => setErrorMessage(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus foto profil?')) {
      try {
        await deleteProfilePhoto(currentUser.id);
        setPhotoPreview(null);
        setSuccessMessage('Foto profil berhasil dihapus');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setErrorMessage(error.message);
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!validateEmail(profileData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Password lama harus diisi';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Password baru harus diisi';
    } else if (!validatePassword(passwordData.newPassword)) {
      newErrors.newPassword = 'Password minimal 6 karakter';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    try {
      await updateProfile(currentUser.id, profileData);
      setSuccessMessage('Profil berhasil diupdate');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    try {
      await changePassword(
        currentUser.id,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setSuccessMessage('Password berhasil diubah');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#00306C] via-[#0063FF] to-[#007EFF] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Profil Saya</h1>
          <p className="text-xl text-white/80">Kelola informasi profil dan keamanan akun Anda</p>
        </div>
        <div className="relative">
          <svg viewBox="0 0 1440 100" className="w-full">
            <path fill="#F9FAFB" d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        {/* Alert Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center space-x-2 animate-pulse">
            <FiCheckCircle className="text-xl" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2 animate-pulse">
            <FiAlertCircle className="text-xl" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              {/* Profile Photo */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto relative group">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4 border-blue-100 shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#007EFF] to-[#0063FF] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                      {currentUser?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  {/* Camera Button */}
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-[#007EFF] to-[#0063FF] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                    <FiCamera className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>

                  {/* Delete Photo Button */}
                  {photoPreview && (
                    <button
                      onClick={handleDeletePhoto}
                      className="absolute top-0 right-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <FiTrash2 className="text-white text-sm" />
                    </button>
                  )}
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-xl font-bold text-gray-900">{currentUser?.name}</h3>
                  <p className="text-sm text-gray-600">{currentUser?.email}</p>
                  <span className="inline-block mt-2 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    Donatur
                  </span>
                </div>
              </div>

              {/* Stats */}
              {stats && (
                <div className="space-y-3 border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#007EFF] to-[#0063FF] rounded-lg flex items-center justify-center">
                        <FiPackage className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total Donasi</div>
                        <div className="text-xl font-bold text-gray-900">{stats.totalDonasi}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <FiClock className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Donasi Aktif</div>
                        <div className="text-xl font-bold text-gray-900">{stats.donasiAktif}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                        <FiCheckCircle className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Donasi Selesai</div>
                        <div className="text-xl font-bold text-gray-900">{stats.donasiSelesai}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 pt-3 border-t border-gray-100">
                    <FiCalendar />
                    <span>Bergabung sejak {formatDate(stats.joinDate)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Tabs */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-4 px-6 font-semibold transition-all ${
                    activeTab === 'profile'
                      ? 'text-[#007EFF] border-b-2 border-[#007EFF]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiUser className="inline mr-2" />
                  Informasi Profil
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 py-4 px-6 font-semibold transition-all ${
                    activeTab === 'security'
                      ? 'text-[#007EFF] border-b-2 border-[#007EFF]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiLock className="inline mr-2" />
                  Keamanan
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Informasi Profil</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-[#007EFF] font-semibold rounded-xl hover:bg-blue-100 transition-all"
                    >
                      <FiEdit2 />
                      <span>Edit Profil</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Nama */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                        isEditing
                          ? 'border-gray-200 focus:border-[#007EFF] focus:ring-4 focus:ring-[#007EFF]/10'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                      } ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                        isEditing
                          ? 'border-gray-200 focus:border-[#007EFF] focus:ring-4 focus:ring-[#007EFF]/10'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                      } ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      No. Telepon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      placeholder="Contoh: 08123456789"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                        isEditing
                          ? 'border-gray-200 focus:border-[#007EFF] focus:ring-4 focus:ring-[#007EFF]/10'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Alamat
                    </label>
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      rows="3"
                      placeholder="Alamat lengkap Anda"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all resize-none ${
                        isEditing
                          ? 'border-gray-200 focus:border-[#007EFF] focus:ring-4 focus:ring-[#007EFF]/10'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      rows="4"
                      placeholder="Ceritakan sedikit tentang Anda"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all resize-none ${
                        isEditing
                          ? 'border-gray-200 focus:border-[#007EFF] focus:ring-4 focus:ring-[#007EFF]/10'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Buttons */}
                  {isEditing && (
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#007EFF] to-[#0063FF] text-white font-bold rounded-xl hover:shadow-xl hover:shadow-[#007EFF]/30 transition-all hover:scale-105 disabled:opacity-50"
                      >
                        <FiSave />
                        <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setProfileData({
                            name: currentUser?.name || '',
                            email: currentUser?.email || '',
                            phone: currentUser?.phone || '',
                            address: currentUser?.address || '',
                            bio: currentUser?.bio || ''
                          });
                          setErrors({});
                        }}
                        className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ubah Password</h2>
                
                <form onSubmit={handleChangePassword} className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Password Lama *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-[#007EFF] focus:ring-4 focus:ring-[#007EFF]/10 transition-all pr-12 ${
                          errors.currentPassword ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Password Baru *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-[#007EFF] focus:ring-4 focus:ring-[#007EFF]/10 transition-all pr-12 ${
                          errors.newPassword ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Konfirmasi Password Baru *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-[#007EFF] focus:ring-4 focus:ring-[#007EFF]/10 transition-all pr-12 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <FiAlertCircle className="text-[#007EFF] text-xl flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold mb-1">Tips Password Aman:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>Minimal 6 karakter</li>
                          <li>Kombinasi huruf besar dan kecil</li>
                          <li>Gunakan angka dan simbol</li>
                          <li>Hindari informasi pribadi yang mudah ditebak</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-[#007EFF] to-[#0063FF] text-white font-bold rounded-xl hover:shadow-xl hover:shadow-[#007EFF]/30 transition-all hover:scale-105 disabled:opacity-50"
                  >
                    <FiLock />
                    <span>{loading ? 'Mengubah Password...' : 'Ubah Password'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilDonatur;