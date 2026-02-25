import ServiceCard from '@/components/ServiceCard';
import ServiceQuickViewModal from '@/components/services/ServiceQuickViewModal';
import { services, Service } from '@/data/services';
import { useState } from 'react';

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

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
          {services.map((service) => (
            <ServiceCard
              key={service.slug}
              service={service}
              onQuickView={() => handleQuickView(service)}
            />
          ))}
        </div>
      </div>

      <ServiceQuickViewModal
        service={selectedService}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
