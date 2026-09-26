import { useNavigate } from "@tanstack/react-router";
import { useLocation } from "@/hooks/use-locations";
import { BusinessProfileDetailView } from "@/components/locations/business-profile-detail-view";
import { Page } from "@/components/layout/page";

export function LocationDetailPage({ id }: { id: string }) {
  const navigate = useNavigate();
  const q = useLocation(id);

  const handleBack = () => {
    navigate({ to: "/locations" });
  };

  return (
    <Page>
      <BusinessProfileDetailView
        onBack={handleBack}
        location={q.data}
      />
    </Page>
  );
}
