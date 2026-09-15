import Container from "@/components/Container";
import Button from "@/components/Button";
import PatternDivider from "@/components/PatternDivider";

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-5rem)] items-center bg-cream motif-dots">
      <Container className="w-full">
        <div className="mx-auto max-w-sm text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maroon-500 text-cream font-display font-bold text-2xl shadow-card">
            B
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold text-maroon-500">
            Bandhan Cultural Association
          </h1>
          <PatternDivider className="mt-4" />
          <p className="mt-4 text-sm text-charcoal-light">
            Continue as a member or explore as a guest.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button href="/login" size="lg" className="flex-1 justify-center">
              Member
            </Button>
            <Button href="/guest" variant="outline" size="lg" className="flex-1 justify-center">
              Guest
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
