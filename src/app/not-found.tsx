import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { GemMotif } from "@/components/ui/GemMotif";

export default function NotFound() {
  return (
    <section className="section-y">
      <div className="container-content flex flex-col items-center text-center">
        <GemMotif gradient strokeWidth={0.8} className="h-16 w-16 opacity-60" />
        <Eyebrow>404</Eyebrow>
        <h1 className="font-display text-display-xl">Aradığınız sayfa bulunamadı</h1>
        <p className="mt-5 max-w-prose text-body-lg text-ink-soft">
          Bu bağlantı taşınmış veya kaldırılmış olabilir. Ana sayfaya dönüp
          koleksiyonlarımıza oradan ulaşabilirsiniz.
        </p>
        <Button href="/" variant="primary" className="mt-8">
          Ana Sayfaya Dön
        </Button>
      </div>
    </section>
  );
}
