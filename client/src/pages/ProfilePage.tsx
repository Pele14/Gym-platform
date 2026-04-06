import AppLayout from "../common/components/AppLayout";
import { ProfileOverview } from "../features/profile";

export default function ProfilePage() {
  return (
    <AppLayout pageTitle="Profile">
      <ProfileOverview />
    </AppLayout>
  );
}
