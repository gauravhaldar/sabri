import DynamicProductPage from "../../components/DynamicProductPage";

export default function FineSilverProductPage({ params }) {
  return (
    <DynamicProductPage
      params={params}
      categoryName="Fine Silver"
      categoryRoute="fine-silver"
    />
  );
}
