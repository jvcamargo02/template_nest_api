import { Brackets, SelectQueryBuilder } from 'typeorm';

export interface FilterParams {
  [key: string]: any;
}

interface DateRange {
  from?: string;
  until?: string;
  field?: string;
}

interface ExactMatch {
  field?: string;
  value?: string;
}

interface SearchParams {
  fields?: string[];
  value?: string;
}

interface OrderParams {
  field?: string;
  order?: 'ASC' | 'DESC';
}

export function buildWhereClause({
  filters = {},
  dateRange = {},
  search = null,
  exactMatch = {},
}: {
  filters: FilterParams;
  dateRange: DateRange;
  search: SearchParams | null;
  exactMatch: ExactMatch;
}): Brackets | undefined {
  return new Brackets((qb) => {
    const parseJSON = (input: any) => {
      if (
        typeof input === 'string' &&
        (input.startsWith('{') || input.startsWith('['))
      ) {
        try {
          return JSON.parse(input);
        } catch {
          // Não faz nada se o parse falhar, mantém o valor original
        }
      }
      return input;
    };

    filters = parseJSON(filters);
    dateRange = parseJSON(dateRange);

    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([innerKey, innerValue]) => {
          qb.andWhere(`${key}.${innerKey} LIKE :innerValue`, {
            innerValue: `%${innerValue}%`,
          });
        });
      } else {
        qb.andWhere(`${key} LIKE :value`, { value: `%${value}%` });
      }
    });

    if (dateRange?.from && dateRange?.field) {
      qb.andWhere(`${dateRange.field} >= :from`, {
        from: new Date(dateRange.from),
      });
    }
    if (dateRange?.until && dateRange?.field) {
      qb.andWhere(`${dateRange.field} <= :until`, {
        until: new Date(dateRange.until),
      });
    }

    if (search) {
      search = parseJSON(search);
      qb.andWhere(
        new Brackets((qb) => {
          search.fields.forEach((field, index) => {
            const method = index === 0 ? 'where' : 'orWhere';
            qb[method](`${field} LIKE :search`, {
              search: `%${search.value}%`,
            });
          });
        }),
      );
    }

    if (exactMatch?.field && exactMatch?.value) {
      exactMatch = parseJSON(exactMatch);
      qb.andWhere(`${exactMatch.field} = :exactMatch`, {
        exactMatch: exactMatch.value,
      });
    }
  });
}

export function applyPaginationAndOrder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  page: number = 1,
  limit: number = 10,
  order: OrderParams | null = null,
): SelectQueryBuilder<T> {
  queryBuilder.take(limit).skip((page - 1) * limit);

  if (order) {
    order = JSON.parse(order as string) ?? order;
    queryBuilder.addOrderBy(order.field, order.order);
  }

  return queryBuilder;
}
