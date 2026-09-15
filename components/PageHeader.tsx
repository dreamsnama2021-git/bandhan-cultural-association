import Container from "@/components/Container";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";

export default function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="bg-beige-light border-b border-maroon-500/10">
      <Container className="py-10 sm:py-14">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && (
          <span className="inline-block text-saffron-700 font-semibold tracking-[0.2em] uppercase text-xs mb-2">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-maroon-500 text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-charcoal-light text-base sm:text-lg leading-relaxed">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
