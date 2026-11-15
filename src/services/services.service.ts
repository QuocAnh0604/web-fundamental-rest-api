// services/services.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";

export interface Service {
  id: string;
  name: string;
  capacity: number;
  price: number;
}

@Injectable()
export class ServicesService {
  private readonly services: Service[] = [
    { id: "svc_001", name: "Spa 60 phút", capacity: 4, price: 350000 },
    { id: "svc_002", name: "Gym theo buổi", capacity: 20, price: 80000 },
  ];

  findAll() {
    return this.services;
  }

  findOne(id: string) {
    const service = this.services.find((item) => item.id === id);
    if (!service) {
      throw new NotFoundException({ message: "Service not found" });
    }
    return service;
  }
}