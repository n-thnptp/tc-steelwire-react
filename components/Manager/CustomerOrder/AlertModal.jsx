const AlertModal = ({ isOpen, onClose, title, message, type = 'success' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          button: 'bg-green-500 hover:bg-green-600',
          title: 'text-green-500'
        };
      case 'error':
        return {
          button: 'bg-red-500 hover:bg-red-600',
          title: 'text-red-500'
        };
      default:
        return {
          button: 'bg-primary-500 hover:bg-primary-600',
          title: 'text-primary-500'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-8 max-w-sm mx-4 z-50 relative flex flex-col items-center">
        {getIcon()}
        <h3 className={`text-xl font-bold mt-4 mb-2 ${colors.title}`}>
          {title}
        </h3>
        <p className="text-center text-gray-600 mb-6">
          {message}
        </p>
        <button
          onClick={onClose}
          className={`${colors.button} text-white px-6 py-2 rounded-full transition-colors duration-200 font-medium`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AlertModal;