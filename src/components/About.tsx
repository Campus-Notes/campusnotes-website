export function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Who We Are
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            CampusNotes+ is a cross-platform mobile application designed to revolutionize how students access and exchange academic knowledge. We believe that quality education resources should be affordable, accessible, and collaborative.
          </p>
          <div className="pt-8 space-y-4">
            <div className="inline-block bg-card rounded-2xl p-8 shadow-lg">
              <p className="text-2xl font-semibold mb-2">Our Mission</p>
              <p className="text-lg text-muted-foreground italic">
                "To make academic knowledge affordable, accessible, and collaborative."
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground pt-4">
            With CampusNotes+, students can upload and sell their notes, buy syllabus-relevant materials, access content offline, chat directly with sellers, earn rewards for contributions, and even donate notes to support their juniors.
          </p>
        </div>
      </div>
    </section>
  );
}