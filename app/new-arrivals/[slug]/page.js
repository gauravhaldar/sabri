import DynamicProductPage from "../../components/DynamicProductPage";

export default function NewArrivalsProductPage({ params }) {
  return (
    <DynamicProductPage
      params={params}
      categoryName="New Arrivals"
      categoryRoute="new-arrivals"
    />
  );
}
