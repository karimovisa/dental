import { Star } from "lucide-react";
import {
  Container,
  SectionHeading,
  Card,
  Avatar,
  Badge,
  RevealGroup,
  RevealItem,
} from "@/components/shared";
import type { ReviewRow } from "@/types";
import { cn } from "@/lib/utils";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

/** Patient testimonials in Google-style cards. */
export function ReviewsSection({ reviews }: { reviews: ReviewRow[] }) {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="scroll-mt-24 bg-secondary/40 py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Patients Say"
          description="Real reviews from patients who trust us with their smiles."
        />

        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <RevealItem key={review.id}>
              <Card className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <Stars rating={review.rating ?? 5} />
                  {review.source && (
                    <Badge variant="muted" className="capitalize">
                      via {review.source}
                    </Badge>
                  )}
                </div>
                {review.text && (
                  <p className="flex-1 text-sm text-pretty text-muted-foreground">
                    “{review.text}”
                  </p>
                )}
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <Avatar name={review.patient_name} src={review.photo_url} size="sm" />
                  <span className="text-sm font-medium text-foreground">
                    {review.patient_name}
                  </span>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
