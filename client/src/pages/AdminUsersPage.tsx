import AppLayout from "../common/components/AppLayout";
import { UsersTable } from "../features/user";

export default function AdminUsersPage() {
  return (
    <AppLayout pageTitle="Admin · Users">
      <UsersTable />
    </AppLayout>
  );
}
