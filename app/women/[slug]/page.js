import DynamicProductPage from "../../components/DynamicProductPage";

export default function WomenProductPage({ params }) {
  return (
    <DynamicProductPage
      params={params}
      categoryName="Women's Collection"
      categoryRoute="women"
    />
  );
}
