import AppLayout from "../common/components/AppLayout";
import { FoodList } from "../features/food";

export default function AdminFoodsPage() {
  return (
    <AppLayout pageTitle="Admin · Food">
      <FoodList />
    </AppLayout>
  );
}
