import { getInitials } from '@utils/helpers';
import { HiPencilSquare } from 'react-icons/hi2';

export default function ProfileCard({ profile, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-700" />
      <div className="px-6 pb-6">
        <div className="flex items-end gap-4 -mt-10 mb-4">
          {profile?.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">
              {getInitials(profile?.name)}
            </div>
          )}
          <button onClick={onEdit} className="mb-1 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            <HiPencilSquare className="w-4 h-4" /> Edit Profile
          </button>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{profile?.name || 'Your Name'}</h2>
        <p className="text-sm text-gray-500 mt-1">{profile?.email || 'your@email.com'}</p>
        {profile?.about && <p className="text-sm text-gray-600 mt-3 leading-relaxed">{profile.about}</p>}
        {profile?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {profile.skills.map(skill => (
              <span key={skill} className="text-xs text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg">{skill}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}