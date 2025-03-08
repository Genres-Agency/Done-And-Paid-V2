import React from "react";
import PageContainer from "../../../_components/page-container";
import AddServiceForm from "../_components/AddServiceForm";

export const metadata = {
  title: "Dashboard : Post Service",
};

export default async function PostServicePage() {
  return (
    <div>
      <PageContainer>
        <AddServiceForm />
      </PageContainer>
    </div>
  );
}
