import DynamicProductPage from "../../components/DynamicProductPage";

export default function GiftsProductPage({ params }) {
  return (
    <DynamicProductPage
      params={params}
      categoryName="Gifts"
      categoryRoute="gifts"
    />
  );
}
