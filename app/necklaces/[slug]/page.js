import DynamicProductPage from "../../components/DynamicProductPage";

export default function NecklacesProductPage({ params }) {
  return (
    <DynamicProductPage
      params={params}
      categoryName="Necklaces"
      categoryRoute="necklaces"
    />
  );
}
