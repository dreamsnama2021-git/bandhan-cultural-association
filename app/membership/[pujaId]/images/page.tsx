import { notFound } from "next/navigation";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import GalleryDriveLink from "@/components/GalleryDriveLink";
import { pujaCategories } from "@/data/pujaCategories";

export function generateStaticParams() {
  return pujaCategories.map((c) => ({ pujaId: c.id }));
}

export default function PujaImagesPage({ params }: { params: { pujaId: string } }) {
  const puja = pujaCategories.find((c) => c.id === params.pujaId);
  if (!puja) notFound();

  return (
    <>
      <PageHeader
        eyebrow="View Images"
        title={`${puja.name} — Gallery`}
        description="Moments from previous celebrations, shared by the association."
        crumbs={[
          { label: "Membership", href: "/membership" },
          { label: puja.name, href: `/membership/${puja.id}` },
          { label: "Images" },
        ]}
      />
      <section className="section-py">
        <Container className="max-w-xl">
          <GalleryDriveLink />
        </Container>
      </section>
    </>
  );
}
