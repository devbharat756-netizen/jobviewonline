import { HiInbox } from 'react-icons/hi2';

export default function EmptyState({ icon: Icon = HiInbox, title = 'Nothing found', description = 'Try adjusting your search or filters.', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
      {action && action}
    </div>
  );
}