import DynamicProductPage from "../../components/DynamicProductPage";

export default function CollectionsProductPage({ params }) {
  return (
    <DynamicProductPage
      params={params}
      categoryName="Collections"
      categoryRoute="collections"
    />
  );
}
