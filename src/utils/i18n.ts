const messages: Record<string, string> = {
  'toast.login_success': 'Xush kelibsiz!',
  'toast.account_created': 'Hisob muvaffaqiyatli yaratildi',
  'toast.logged_out': 'Tizimdan chiqdingiz',
  'toast.profile_updated': "Profil ma'lumotlari yangilandi",
  'toast.profile_update_failed': "Profilni yangilashda xatolik yuz berdi",
  'toast.avatar_uploaded': 'Avatar yuklandi',
  'toast.avatar_upload_failed': 'Avatar yuklashda xatolik yuz berdi',
  'toast.avatar_deleted': "Avatar o'chirildi",
  'toast.avatar_delete_failed': "Avatarni o'chirishda xatolik yuz berdi",
  'toast.password_changed': "Parol o'zgartirildi",
  'toast.password_change_failed': "Parolni o'zgartirishda xatolik yuz berdi",
  'toast.user_updated': 'Foydalanuvchi yangilandi',
  'toast.user_update_failed': 'Foydalanuvchini yangilashda xatolik yuz berdi',
  'toast.user_deleted': "Foydalanuvchi o'chirildi",
  'toast.user_delete_failed': "Foydalanuvchini o'chirishda xatolik yuz berdi",
}

export function translate(key: string) {
  return messages[key] ?? key
}
