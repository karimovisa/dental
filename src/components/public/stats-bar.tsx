import { Container, Reveal } from "@/components/shared";
import { stats } from "@/data";

/** Wide light-blue card highlighting four headline metrics. */
export function StatsBar() {
  return (
    <section className="py-6">
      <Container>
        <Reveal>
          <div className="grid grid-cols-2 gap-y-8 rounded-3xl bg-accent px-6 py-10 sm:px-10 lg:grid-cols-4 lg:divide-x lg:divide-primary/10">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col items-center gap-1 text-center lg:px-4"
              >
                <span className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  {stat.value.toLocaleString("en-US")}
                  {stat.suffix}
                </span>
                <span className="text-sm font-medium text-accent-foreground/80">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
