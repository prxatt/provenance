import Image from 'next/image';
import Revealer from '@/components/Revealer';
import type { ProductFeatureSection } from '@/lib/types';

type Props = {
  section: ProductFeatureSection;
  index: number;
};

export default function ProductFeatureBand({ section, index }: Props) {
  const imageLeft =
    section.imagePosition === 'left' || (section.imagePosition !== 'right' && index % 2 === 0);

  const image = (
    <div className="relative min-h-[420px] lg:min-h-[560px]">
      <Image
        src={section.image}
        alt={section.title}
        fill
        className="object-cover object-center opacity-85"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );

  const copy = (
    <div className="flex items-center px-8 py-20 md:px-16 lg:px-20">
      <Revealer>
        <p className="kicker">{section.kicker}</p>
        <h2 className="h2 mt-5">{section.title}</h2>
        <p className="body mt-6 max-w-lg">{section.body}</p>
        <div className="mt-8 h-px w-10 bg-[var(--gold)]" />
      </Revealer>
    </div>
  );

  return (
    <section className="grid grid-cols-1 border-t border-white/10 lg:grid-cols-2">
      {imageLeft ? (
        <>
          {image}
          {copy}
        </>
      ) : (
        <>
          <div className="order-2 lg:order-1">{copy}</div>
          <div className="order-1 lg:order-2">{image}</div>
        </>
      )}
    </section>
  );
}
