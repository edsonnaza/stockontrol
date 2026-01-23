import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ConfirmOptions {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [confirmState, setConfirmState] = useState<ConfirmOptions & { open: boolean; resolve?: (value: boolean) => void } | null>(null);

    const confirm = useCallback(
        (options: ConfirmOptions): Promise<boolean> => {
            return new Promise((resolve) => {
                setConfirmState({
                    ...options,
                    open: true,
                    resolve,
                });
            });
        },
        []
    );

    const handleConfirm = () => {
        if (confirmState?.resolve) {
            confirmState.resolve(true);
        }
        setConfirmState(null);
    };

    const handleCancel = () => {
        if (confirmState?.resolve) {
            confirmState.resolve(false);
        }
        setConfirmState(null);
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {confirmState && (
                <ConfirmDialog
                    open={confirmState.open}
                    title={confirmState.title}
                    description={confirmState.description}
                    confirmText={confirmState.confirmText}
                    cancelText={confirmState.cancelText}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmProvider');
    }
    return context;
};

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
            <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4 dark:bg-slate-900">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>
                {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{description}</p>}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
