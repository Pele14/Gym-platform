import AppLayout from "../common/components/AppLayout";
import { NearbyGymsView } from "../features/gyms";

export default function GymsPage() {
  return (
    <AppLayout pageTitle="Gyms">
      <NearbyGymsView />
    </AppLayout>
  );
}