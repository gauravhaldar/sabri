import DynamicProductPage from "../../components/DynamicProductPage";

export default function FineGoldProductPage({ params }) {
  return (
    <DynamicProductPage
      params={params}
      categoryName="Fine Gold"
      categoryRoute="fine-gold"
    />
  );
}
