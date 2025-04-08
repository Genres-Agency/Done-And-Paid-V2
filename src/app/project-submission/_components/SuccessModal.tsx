"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

interface SuccessModalProps {
  showSuccessModal: boolean;
  setShowSuccessModal: (show: boolean) => void;
  submittedEmail: string;
}

export function SuccessModal({
  showSuccessModal,
  setShowSuccessModal,
  submittedEmail,
}: SuccessModalProps) {
  return (
    <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Track Your Project Updates</DialogTitle>
          <DialogDescription className="pt-2">
            Want to stay updated on your project's progress? Register an account
            using <span className="font-medium">{submittedEmail}</span> to
            access:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Real-time project status updates</li>
              <li>Milestone tracking</li>
              <li>Direct communication with our team</li>
              <li>Project history and documentation</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            variant="default"
            onClick={() => {
              setShowSuccessModal(false);
              window.location.href = "/auth/register";
            }}
          >
            Register Now
          </Button>
          <Button variant="outline" onClick={() => setShowSuccessModal(false)}>
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
