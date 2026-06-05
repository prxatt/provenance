import CollectionView from '@/components/CollectionView';
import { getCollectionCatalog, img } from '@/lib/data';

export default async function Collection() {
  const products = await getCollectionCatalog();
  return (
    <CollectionView
      products={products}
      heroImage={img.collectionHero}
      watchesImage={img.watches}
      jewelryImage={img.jewelry}
    />
  );
}
