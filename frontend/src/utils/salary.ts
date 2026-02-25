import type { Employee } from '@/backend';

export interface SalaryBreakdown {
  base: number;
  bonus: number;
  pfDeduction: number;
  leaveDeduction: number;
  finalPayable: number;
}

export function calculateSalaryBreakdown(employee: Employee): SalaryBreakdown {
  const base = Number(employee.salary.base);
  const bonus = Number(employee.bonus);
  const pfDeduction = Number(employee.salary.pfDeduction);
  
  const leaveDeduction = 0;
  
  const finalPayable = base + bonus - pfDeduction - leaveDeduction;

  return {
    base,
    bonus,
    pfDeduction,
    leaveDeduction,
    finalPayable: Math.max(0, finalPayable),
  };
}
