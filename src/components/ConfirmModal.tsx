import { ReactNode } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message
}) => {
    if (!isOpen) return null;
    return(
        <div
            className='fixed inset-0 bg-black bg-opacity-50 flex item-center justify-center z-50'
            onClick={onClose}
        >
            <div
                className='bg-white rounded-lg p-6 max-w-sm w-full shadow-x1'
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className='text-lg font-medium mb-2'>{title}</h3>
                <div className='text-gray-600 mb-6'>{message}</div>
                <div className='flex justify-end space-x-3'>
                    <button 
                        onClick={onClose}
                        className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition focus:outline-none focus:ring-gray-400'
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500'
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;