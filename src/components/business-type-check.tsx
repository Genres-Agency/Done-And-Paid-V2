"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useBusinessTypeModal } from "@/src/hooks/use-business-type-modal";
import { BusinessTypeModal } from "@/src/components/modals/business-type-modal";

export const BusinessTypeCheck = () => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose, onSubmit } = useBusinessTypeModal();

  useEffect(() => {
    if (session?.user && !(session.user as any).businessType) {
      onOpen(session.user.id);
    }
  }, [session]);

  return (
    <BusinessTypeModal isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} />
  );
};
