import { Users, DollarSign, Shield, Briefcase, LucideIcon } from 'lucide-react';

export interface Service {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export const services: Service[] = [
  {
    slug: 'hr-consulting',
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
    slug: 'payroll-management',
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
    slug: 'compliance-legal',
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
    slug: 'recruitment-services',
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

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
