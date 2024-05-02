import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'CnpjCpfValidator', async: false })
@Injectable()
export class CnpjCpfValidator implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    let cpfCnpj = value;
    cpfCnpj = cpfCnpj?.replace(/[^\d]+/g, '');
    if (cpfCnpj?.length > 11) return this?.cnpjIsValid(cpfCnpj);
    return this?.cpfIsValid(cpfCnpj);
  }

  defaultMessage(value: any): string {
    return value?.property === 'cpf' ? 'O CPF é inválido' : 'O CNPJ é inválido';
  }

  cpfIsValid(cpf: string): boolean {
    cpf = cpf?.replace(/[\s.-]*/gim, '');
    if (cpf?.length !== 11) return false;

    for (let i = 0; i <= 9; i += 1) {
      const invalidCpf = `${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}`;
      if (cpf === invalidCpf) return false;
    }

    let sum = 0;
    let rest: number;

    for (let i = 1; i <= 9; i += 1) {
      sum += Number(cpf?.substring(i - 1, i)) * (11 - i);
    }
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== Number(cpf?.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i += 1) {
      sum += Number(cpf?.substring(i - 1, i)) * (12 - i);
    }
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== Number(cpf?.substring(10, 11))) return false;

    return true;
  }

  cnpjIsValid(cnpj: string): boolean {
    cnpj = cnpj?.replace(/[^\d]+/g, '');
    if (cnpj === '') return false;

    if (cnpj?.length !== 14) return false;

    for (let i = 0; i <= 9; i += 1) {
      const invalidCnpj = `${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}`;
      if (cnpj === invalidCnpj) return false;
    }

    const sequenceDigit1: number[] = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sequenceDigit2: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    let rest: number;

    // digito1
    for (let i = 0; i <= 11; i += 1) {
      sum += Number(cnpj[i]) * sequenceDigit1[i];
    }

    rest = sum % 11;
    rest = rest < 2 ? 0 : 11 - rest;
    if (rest !== Number(cnpj[12])) return false;

    // digito2
    sum = 0;
    rest = 0;
    for (let i = 0; i <= 12; i += 1) {
      sum += Number(cnpj[i]) * sequenceDigit2[i];
    }

    rest = sum % 11;
    rest = rest < 2 ? 0 : 11 - rest;
    if (rest !== Number(cnpj[13])) return false;

    return true;
  }
}

export const IsCnpjCpf =
  (Property: string, options?: ValidationOptions) =>
  (object: any, propertyName: string) =>
    registerDecorator({
      name: `IsCnpjCpf${Property}`,
      target: object.constructor,
      propertyName,
      options,
      constraints: [Property],
      validator: CnpjCpfValidator,
    });
