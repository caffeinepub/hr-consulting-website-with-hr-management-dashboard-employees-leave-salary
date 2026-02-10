import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LeadershipCard from '@/components/LeadershipCard';

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
          <p className="text-lg text-muted-foreground mb-12">
            We are a leading HR consulting firm dedicated to helping businesses build stronger,
            more efficient workforces through innovative HR solutions and expert guidance.
          </p>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to empower organizations with comprehensive HR solutions that drive
                  growth, ensure compliance, and foster a positive workplace culture. We believe in
                  building long-term partnerships with our clients, providing them with the tools and
                  expertise needed to navigate the complex landscape of human resource management.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We strive for excellence in every service we provide, ensuring the highest
                    standards of quality and professionalism.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We operate with transparency and honesty, building trust with our clients through
                    ethical practices.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We embrace innovative solutions and stay ahead of industry trends to deliver
                    cutting-edge HR services.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Leadership</h2>
            <LeadershipCard
              name="Vishwesh Shivankar"
              title="HR Director"
              description="With extensive experience in human resource management and organizational development, Vishwesh leads our team with a vision to transform HR practices across industries. His expertise spans talent acquisition, employee engagement, compliance, and strategic workforce planning."
            />
          </section>
        </div>
      </div>
    </div>
  );
}
