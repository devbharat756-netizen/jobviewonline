export default function AdPlaceholder({ type = 'horizontal', label = 'Advertisement' }) {
  const styles = {
    horizontal: 'w-full h-[90px] md:h-[100px]',
    vertical: 'w-[300px] h-[600px]',
    square: 'w-[300px] h-[250px]',
    infeed: 'w-full h-[120px]',
  };

  return (
    <div
      className={`${styles[type]} border border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 text-sm`}
      aria-hidden="true"
    >
      <span>{label}</span>
    </div>
  );
}