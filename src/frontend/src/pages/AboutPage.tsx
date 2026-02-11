import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LeadershipCard from '@/components/LeadershipCard';
import { Target, Eye, Lightbulb, Shield, Users, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-16 md:py-20">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">About Us</h1>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full mb-8"></div>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              We are a leading HR consulting firm dedicated to helping businesses build stronger,
              more efficient workforces through innovative HR solutions and expert guidance.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Mission</h2>
            </div>
            <Card className="about-card border-2">
              <CardContent className="pt-8 pb-8">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Our mission is to empower organizations with comprehensive HR solutions that drive
                  growth, ensure compliance, and foster a positive workplace culture. We believe in
                  building long-term partnerships with our clients, providing them with the tools and
                  expertise needed to navigate the complex landscape of human resource management.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Values Section */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <Card className="about-card border-2 motion-safe:hover:border-primary/50 motion-safe:transition-all motion-safe:duration-300">
                <CardHeader className="pb-4">
                  <div className="mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    We strive for excellence in every service we provide, ensuring the highest
                    standards of quality and professionalism.
                  </p>
                </CardContent>
              </Card>

              <Card className="about-card border-2 motion-safe:hover:border-primary/50 motion-safe:transition-all motion-safe:duration-300">
                <CardHeader className="pb-4">
                  <div className="mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Shield className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    We operate with transparency and honesty, building trust with our clients through
                    ethical practices.
                  </p>
                </CardContent>
              </Card>

              <Card className="about-card border-2 motion-safe:hover:border-primary/50 motion-safe:transition-all motion-safe:duration-300">
                <CardHeader className="pb-4">
                  <div className="mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Lightbulb className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    We embrace innovative solutions and stay ahead of industry trends to deliver
                    cutting-edge HR services.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Leadership Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Leadership</h2>
            </div>
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
