import DynamicProductPage from "../../components/DynamicProductPage";

export default function BraceletsProductPage({ params }) {
  return (
    <DynamicProductPage
      params={params}
      categoryName="Bracelets"
      categoryRoute="bracelets"
    />
  );
}
