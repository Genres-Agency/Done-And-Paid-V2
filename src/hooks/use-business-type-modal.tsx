"use client";

import { create } from "zustand";
import { updateBusinessType } from "@/src/actions/auth/update-business-type";

interface BusinessTypeModalStore {
  isOpen: boolean;
  userId: string | null;
  onOpen: (userId: string) => void;
  onClose: () => void;
  onSubmit: (businessType: string) => Promise<void>;
}

export const useBusinessTypeModal = create<BusinessTypeModalStore>((set) => ({
  isOpen: false,
  userId: null,
  onOpen: (userId: string) => set({ isOpen: true, userId }),
  onClose: () => set({ isOpen: false }),
  onSubmit: async (businessType: string) => {
    try {
      const { userId } = useBusinessTypeModal.getState();
      if (!userId) return;

      const result = await updateBusinessType(userId, businessType as any);
      if (result.error) {
        throw new Error(result.error);
      }

      set({ isOpen: false });
    } catch (error) {
      console.error("Error updating business type:", error);
      throw error;
    }
  },
}));
