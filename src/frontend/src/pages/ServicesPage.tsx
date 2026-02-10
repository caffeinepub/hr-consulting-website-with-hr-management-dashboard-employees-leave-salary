import ServiceCard from '@/components/ServiceCard';
import { Users, DollarSign, Shield, Briefcase } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: Users,
      title: 'HR Consulting',
      description:
        'Comprehensive HR consulting services to help you build effective HR strategies, policies, and procedures. We provide expert guidance on organizational structure, performance management, employee relations, and HR best practices tailored to your business needs.',
      features: [
        'HR strategy development',
        'Policy and procedure design',
        'Organizational restructuring',
        'Performance management systems',
        'Employee engagement programs',
      ],
    },
    {
      icon: DollarSign,
      title: 'Payroll Management',
      description:
        'Streamlined payroll processing services that ensure accurate and timely salary disbursement. We handle all aspects of payroll including salary calculations, statutory deductions, tax compliance, and detailed reporting to keep your payroll operations running smoothly.',
      features: [
        'Accurate salary processing',
        'PF and ESI management',
        'Tax deduction and filing',
        'Payroll reports and analytics',
        'Compliance with labor laws',
      ],
    },
    {
      icon: Shield,
      title: 'Compliance & Legal Services',
      description:
        'Stay compliant with ever-changing labor laws and regulations. Our compliance services cover all aspects of employment law, statutory requirements, and legal documentation to protect your business from legal risks and ensure adherence to Indian labor regulations.',
      features: [
        'Labor law compliance',
        'Contract drafting and review',
        'Statutory compliance audits',
        'Legal documentation',
        'Dispute resolution support',
      ],
    },
    {
      icon: Briefcase,
      title: 'Recruitment Services',
      description:
        'End-to-end recruitment solutions to help you find and hire the best talent. From job posting to candidate screening and onboarding, we manage the entire recruitment lifecycle. Our services are integrated with LinkedIn to maximize reach and connect you with top professionals.',
      features: [
        'Job posting and advertising',
        'Candidate sourcing and screening',
        'Interview coordination',
        'Background verification',
        'Onboarding support',
      ],
    },
  ];

  return (
    <div className="py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-lg text-muted-foreground">
            We offer a comprehensive suite of HR services designed to meet the diverse needs of
            modern businesses. From strategic consulting to day-to-day operations, we're here to
            support your HR function at every level.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
}
