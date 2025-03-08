"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditServiceForm from "../../_components/EditServiceForm";

export default function EditServicePage() {
  return (
    <div className="container py-6">
      <EditServiceForm />
    </div>
  );
}