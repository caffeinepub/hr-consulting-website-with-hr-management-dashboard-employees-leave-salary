import ContactSection from '@/components/contact/ContactSection';

export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Get in touch with us to discuss how we can help your organization achieve its HR goals.
              We're here to answer your questions and provide expert guidance.
            </p>
          </div>
          <ContactSection showTitle={false} showDescription={false} showBusinessHours={true} />
        </div>
      </div>
    </div>
  );
}
