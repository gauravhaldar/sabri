import DynamicProductPage from "../../components/DynamicProductPage";

export default function BestSellersProductPage({ params }) {
  return (
    <DynamicProductPage
      params={params}
      categoryName="Best Sellers"
      categoryRoute="best-sellers"
    />
  );
}
