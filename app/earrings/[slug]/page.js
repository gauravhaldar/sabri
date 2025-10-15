import DynamicProductPage from "../../components/DynamicProductPage";

export default function EarringsProductPage({ params }) {
  return (
    <DynamicProductPage
      params={params}
      categoryName="Earrings"
      categoryRoute="earrings"
    />
  );
}
