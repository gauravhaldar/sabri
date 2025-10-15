import DynamicProductPage from "../../components/DynamicProductPage";

export default function RingsProductPage({ params }) {
  return (
    <DynamicProductPage
      params={params}
      categoryName="Rings"
      categoryRoute="rings"
    />
  );
}
