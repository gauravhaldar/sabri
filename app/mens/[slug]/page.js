import DynamicProductPage from "../../components/DynamicProductPage";

export default function MensProductPage({ params }) {
  return (
    <DynamicProductPage
      params={params}
      categoryName="Mens"
      categoryRoute="mens"
    />
  );
}
