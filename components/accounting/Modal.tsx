"use client";

import React, { useState } from 'react';

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

type ModalComponentProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    modalTitle: string;
    onSave: (setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => void;
    children: React.ReactNode;
};

const ModalComponent = ({ isOpen, onOpenChange, modalTitle, onSave, children }: ModalComponentProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = (onClose: () => void) => {
        setIsLoading(true);
        onSave(setIsLoading); 
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 border-b-1 mb-2 dark:text-white">
                            {modalTitle}
                        </ModalHeader>
                        <ModalBody>
                            {children}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button
                                color="primary"
                                disabled={isLoading}
                                onPress={() => {
                                    handleSave(onClose); 
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <span>Saving..</span>
                                        <svg
                                            className="w-5 h-5 text-white ml-2 animate-spin"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                                            ></path>
                                        </svg>
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ModalComponent;
