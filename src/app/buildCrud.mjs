/* eslint-disable @typescript-eslint/no-unused-vars */
import readlineSync from 'readline-sync';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import pluralize from 'pluralize';

const __filename = new URL(import.meta.url).pathname;
const __dirname = decodeURI(path.dirname(__filename));

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getEntityInfo = () => {
  const entityName = capitalizeFirstLetter(
    readlineSync.question('Qual o nome da Entidade? (No Plural, ex.: users):'),
  );

  const fields = [];
  let addMoreFields = true;

  while (addMoreFields) {
    const fieldName = readlineSync.question('Digite o nome do campo: ');

    const fieldType = getFieldDataType();

    const minFieldSize = getMinFieldSize(fieldType);

    const maxFieldSize = getMaxFieldSize(fieldType);

    const validationRules = getFieldValidationRules(
      fieldType,
      minFieldSize,
      maxFieldSize,
    );

    const isOptional = readlineSync.keyInYNStrict('O campo é opcional?');

    const defaultDescription = `${fieldName} da ${entityName}`;
    const description = readlineSync.question(
      `Digite a descrição para a documentação do campo ${fieldName} da ${entityName} (enter para padrão): `,
      { defaultInput: defaultDescription },
    );

    const relatedEntity =
      fieldType === 'relation' ? getRelatedEntity(fieldName) : null;

    const relationshipType =
      relatedEntity && fieldType === 'relation'
        ? getRelationshipType(fieldName)
        : null;

    const enumValues = fieldType === 'enum' ? getEnumValues(fieldName) : null;

    fields.push({
      name: fieldName,
      type: fieldType,
      minSize: minFieldSize,
      maxSize: maxFieldSize,
      validations: validationRules,
      optional: isOptional,
      description: description || defaultDescription,
      relatedEntity: relatedEntity,
      relationshipType: relationshipType,
      enumValues: enumValues,
      example:
        fieldType === 'enum'
          ? enumValues[0].key
          : fieldType === 'int'
            ? 1
            : fieldType === 'decimal'
              ? 1.5
              : fieldType === 'date'
                ? '2021-01-01'
                : fieldType === 'url'
                  ? 'https://www.google.com'
                  : 'string',
    });

    addMoreFields = readlineSync.keyInYNStrict(
      'Deseja adicionar mais um campo?',
    );
  }

  return { entityName, fields };
};

const getFieldDataType = () => {
  const dataTypes = [
    'varchar',
    'enum',
    'text',
    'int',
    'decimal',
    'date',
    'relation',
  ];
  const index = readlineSync.keyInSelect(dataTypes, 'Escolha o tipo do campo:');
  return dataTypes[index];
};

const getMinFieldSize = (fieldType) => {
  if (fieldType === 'varchar') {
    return readlineSync.questionInt(
      'Digite o tamanho minimo do campo (opcional): ',
      {
        defaultInput: null,
      },
    );
  }
  return null;
};

const getMaxFieldSize = (fieldType) => {
  if (fieldType === 'varchar') {
    return readlineSync.questionInt(
      'Digite o tamanho máximo do campo (opcional): ',
      {
        defaultInput: null,
      },
    );
  }
  return null;
};

const getFieldValidationRules = (fieldType, minFieldSize, maxFieldSize) => {
  let validationRules = ['IsNotEmpty'];

  if (fieldType === 'varchar') {
    validationRules.push('IsString');
    if (minFieldSize || maxFieldSize) {
      validationRules.push(
        `Length(${minFieldSize ?? 0}, ${maxFieldSize ?? 'infinitos'})`,
      );
    }
  } else if (fieldType === 'enum') {
    validationRules.push('IsEnum');
  } else if (fieldType === 'text') {
    validationRules.push('IsString');
  } else if (fieldType === 'int' || fieldType === 'decimal') {
    validationRules.push('IsNumber');
  } else if (fieldType === 'date') {
    validationRules.push('IsDateString');
  } else if (fieldType === 'relation') {
    // No specific validation rules for relations yet
  }

  if (
    fieldType !== 'relation' &&
    readlineSync.keyInYNStrict('Deseja adicionar validação adicional?')
  ) {
    const additionalValidations = getAdditionalValidations();
    validationRules = validationRules.concat(additionalValidations);
  }

  return validationRules;
};

const getAdditionalValidations = () => {
  const additionalValidations = [];
  const options = [
    'é URL',
    'é decimal',
    'é string numérica',
    'transform',
    // Adicione mais opções conforme necessário
  ];

  options.forEach((option, index) => {
    if (readlineSync.keyInYNStrict(`${option}?`)) {
      additionalValidations.push(`CustomValidation(${index})`);
    }
  });

  return additionalValidations;
};

const getRelatedEntity = (fieldName) => {
  return readlineSync.question(
    `Digite o nome da entidade relacionada para o campo ${fieldName}: `,
  );
};

const getRelationshipType = (fieldName) => {
  const relationshipTypes = ['OneToMany', 'ManyToOne', 'OneToOne'];
  const index = readlineSync.keyInSelect(
    relationshipTypes,
    `Escolha o tipo de relacionamento para o campo ${fieldName}:`,
  );
  return relationshipTypes[index];
};

const getEnumValues = (fieldName) => {
  const values = [];
  let addMoreValues = true;

  console.log(
    chalk.blue(
      `Digite as chaves e valores para o enum do campo ${fieldName} (ex.: "ACTIVE" = "Ativo"):`,
    ),
  );

  while (addMoreValues) {
    const enumKey = readlineSync.question('Digite a chave do enum: ');
    const enumValue = readlineSync.question('Digite o valor do enum: ');
    values.push({ key: enumKey, value: enumValue });

    addMoreValues = readlineSync.keyInYNStrict(
      'Deseja adicionar mais um valor ao enum?',
    );
  }

  return values;
};

const confirmDefinitions = (entityName, fields) => {
  console.log(chalk.blue(`\nCriando CRUD para ${entityName} com os campos:\n`));

  fields.forEach((field) => {
    let fieldDescription = `${field.name} (${field.type}`;

    if (field.size) {
      fieldDescription += `, ${field.size} caracteres`;
    }

    if (field.optional) {
      fieldDescription += ', opcional';
    }

    if (field.validations.length > 1) {
      fieldDescription += `, ${field.validations.slice(1).join(', ')}`;
    }

    if (field.relatedEntity) {
      fieldDescription += `, relacionando-se com ${field.relatedEntity}`;
    }

    if (field.relationshipType) {
      fieldDescription += `, ${field.relationshipType}`;
    }

    if (field.enumValues) {
      fieldDescription += `, valores possíveis: ${field.enumValues
        .map((enumValue) => `'${enumValue.key}' = '${enumValue.value}'`)
        .join(', ')}`;
    }

    fieldDescription += ')';
    console.log(chalk.blue(fieldDescription));
  });

  return readlineSync.keyInYNStrict('\nContinuar a criação?');
};

const generateEnumFile = (entityName, field) => {
  const enumFolderPath = path.join(
    __dirname,
    `${entityName.toLowerCase()}`,
    'enum',
  );

  if (!fs.existsSync(enumFolderPath)) {
    fs.mkdirSync(enumFolderPath, { recursive: true });
  }

  const enumFilePath = path.join(
    enumFolderPath,
    `${field.name.toLowerCase()}.enum.ts`,
  );

  const enumValues = field.enumValues
    .map((enumValue) => `${enumValue.key} = '${enumValue.value}'`)
    .join(',\n  ');

  const enumFileContent = `
export enum ${pluralize.singular(
    capitalizeFirstLetter(entityName),
  )}${capitalizeFirstLetter(field.name)}Enum {
  ${enumValues}
}
`;

  fs.writeFileSync(enumFilePath, enumFileContent);

  console.log(
    chalk.green(
      `Arquivo de enum para o campo ${field.name} gerado com sucesso.`,
    ),
  );
};

const generateCRUD = (entidade, campos) => {
  try {
    // Gera o Controller
    execSync(`npx nest generate controller ${entidade} --no-spec`);

    // Gera o Service
    execSync(`npx nest generate service ${entidade} --no-spec`);

    generateController(entidade);

    generateModule(entidade);

    generateDto(entidade);

    fields.forEach((field) => {
      if (field.type === 'enum') {
        generateEnumFile(entityName, field);
      }
    });

    generateEntityFile(entidade, campos);

    generateService(entidade, campos);

    console.log(chalk.green(`CRUD para ${entidade} gerado com sucesso.`));
  } catch (error) {
    console.error(
      chalk.red(`Erro ao gerar CRUD para ${entidade}:`, error.message),
    );
  }
};

const generateModule = (entity) => {
  try {
    const modulePath = path.join(
      __dirname,
      `${entity.toLowerCase()}`,
      `${entity.toLowerCase()}.module.ts`,
    );

    const moduleContent = `
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';


import { ${capitalizeFirstLetter(entity)}Service } from './${entity.toLowerCase()}.service';
import { ${pluralize.singular(capitalizeFirstLetter(entity))} } from './entities/${pluralize.singular(entity.toLowerCase())}.entity';
import { ${capitalizeFirstLetter(entity)}Controller } from './${entity.toLowerCase()}.controller';

@Module({
  imports: [TypeOrmModule.forFeature([${pluralize.singular(capitalizeFirstLetter(entity))}])],
  controllers: [${capitalizeFirstLetter(entity)}Controller],
  providers: [${capitalizeFirstLetter(entity)}Service],
})
export class ${capitalizeFirstLetter(entity)}Module {}
`;

    fs.writeFileSync(modulePath, moduleContent);

    console.log(chalk.green(`Módulo para ${entity} gerado com sucesso.`));
  } catch (error) {
    console.error(
      chalk.red(`Erro ao gerar módulo para ${entity}:`, error.message),
    );
  }
};

const generateDto = (entity) => {
  try {
    const dtoPath = path.join(__dirname, `${entity.toLowerCase()}`, 'dto');

    if (!fs.existsSync(dtoPath)) {
      fs.mkdirSync(dtoPath, { recursive: true });
    }

    const createDtoPath = path.join(
      __dirname,
      `${entity.toLowerCase()}`,
      'dto',
      `create-${pluralize.singular(entity.toLowerCase())}.dto.ts`,
    );

    const updateDtoPath = path.join(
      __dirname,
      `${entity.toLowerCase()}`,
      'dto',
      `update-${pluralize.singular(entity.toLowerCase())}.dto.ts`,
    );

    const createDtoContent = `
     import { OmitType } from '@nestjs/swagger';
      import { ${pluralize.singular(capitalizeFirstLetter(entity))} } from '../entities/${pluralize.singular(entity.toLowerCase())}.entity';

      export class Create${pluralize.singular(capitalizeFirstLetter(entity))}Dto extends OmitType(${pluralize.singular(
        capitalizeFirstLetter(entity),
      )}, ['id', 'createdAt', 'updatedAt', 'deletedAt'] as const) {}
      
    `;

    const updateDtoContent = `
    import { PartialType } from '@nestjs/swagger';
    import { Create${pluralize.singular(capitalizeFirstLetter(entity))}Dto } from './create-${pluralize.singular(capitalizeFirstLetter(entity))}.dto';

    export class Update${pluralize.singular(capitalizeFirstLetter(entity))}Dto extends PartialType(Create${pluralize.singular(capitalizeFirstLetter(entity))}Dto) {}
    `;

    fs.writeFileSync(createDtoPath, createDtoContent);
    fs.writeFileSync(updateDtoPath, updateDtoContent);

    console.log(chalk.green(`DTOs para ${entity} gerados com sucesso.`));
  } catch (error) {
    console.error(
      chalk.red(`Erro ao gerar DTOs para ${entity}:`, error.message),
    );
  }
};

const generateController = (entity) => {
  try {
    const controllerPath = path.join(
      __dirname,
      `${entity.toLowerCase()}`,
      `${entity.toLowerCase()}.controller.ts`,
    );

    const controllerContent = `
import { Body, Controller, Param, Query } from '@nestjs/common';

import { CreateOperation, FindAllOperation, FindOneOperation, RemoveOperation, UpdateOperation } from '@operations/index.operation.decorator';
import { handleErrors } from '@decorators/errors/error.handler.decorator';
import { QueryParamsDto } from '@pipes/get-queries-validator.pipe';

import { ${capitalizeFirstLetter(entity)}Service } from './${entity.toLowerCase()}.service';
import { Create${pluralize.singular(capitalizeFirstLetter(entity))}Dto } from './dto/create-${pluralize.singular(entity).toLowerCase()}.dto';
import { Update${pluralize.singular(capitalizeFirstLetter(entity))}Dto } from './dto/update-${pluralize.singular(entity).toLowerCase()}.dto';


@Controller()
export class ${capitalizeFirstLetter(entity)}Controller {
  constructor(private readonly ${entity.toLowerCase()}Service: ${capitalizeFirstLetter(
    entity,
  )}Service) {}
  
    @CreateOperation({
      model: ${pluralize.singular(capitalizeFirstLetter(entity))},
      route: '/${entity.toLowerCase()}',
      tags: ['${entity.toLowerCase()}'],
      dto: Create${pluralize.singular(capitalizeFirstLetter(entity))}Dto,
      authenticated: true,
    })
    async create(@Body() create${pluralize.singular(capitalizeFirstLetter(entity))}Dto: Create${pluralize.singular(capitalizeFirstLetter(entity))}Dto) {
      try {
        return await this.${entity.toLocaleLowerCase()}Service.create(create${pluralize.singular(capitalizeFirstLetter(entity))}Dto);
      } catch (error) {
        handleErrors(error);
      }
    }

    @FindAllOperation({
      model: ${pluralize.singular(capitalizeFirstLetter(entity))},
      route: '/${entity.toLowerCase()}',
      tags: ['${entity.toLowerCase()}'],
      authenticated: true,
    })
    async findAll(@Query() queryParams: QueryParamsDto) {
      try {
        return await this.${entity.toLocaleLowerCase()}Service.findAll(queryParams);
      } catch (error) {
        handleErrors(error);
      }
    }

    @FindOneOperation({
      model: ${pluralize.singular(capitalizeFirstLetter(entity))},
      route: '/${entity.toLowerCase()}/:id',
      tags: ['${entity.toLowerCase()}'],
      authenticated: true,
    })
    async findOne(@Param('id') id: number) {
      try {
        return await this.${entity.toLocaleLowerCase()}Service.findOne(id);
      } catch (error) {
        handleErrors(error);
      }
    }

    @UpdateOperation({
      model: ${pluralize.singular(capitalizeFirstLetter(entity))},
      route: '/${entity.toLowerCase()}/:id',
      tags: ['${entity.toLowerCase()}'],
      dto: Update${pluralize.singular(capitalizeFirstLetter(entity))}Dto,
      authenticated: true,
    })
    async update(@Param('id') id: number, @Body() update${pluralize.singular(capitalizeFirstLetter(entity))}Dto: Update${pluralize.singular(capitalizeFirstLetter(entity))}Dto) {
      try {
        return await this.${entity.toLocaleLowerCase()}Service.update(id, update${pluralize.singular(capitalizeFirstLetter(entity))}Dto);
      } catch (error) {
        handleErrors(error);
      }
    }

    @RemoveOperation({
      model: ${pluralize.singular(capitalizeFirstLetter(entity))},
      route: '/${entity.toLowerCase()}/:id',
      tags: ['${entity.toLowerCase()}'],
      authenticated: true,
    })
    async remove(@Param('id') id: number) {
      try {
        return await this.${entity.toLocaleLowerCase()}Service.remove(id);
      } catch (error) {
        handleErrors(error);
      }
    }

}
`;

    fs.writeFileSync(controllerPath, controllerContent);

    console.log(chalk.green(`Controller para ${entity} gerado com sucesso.`));
  } catch (error) {
    console.error(
      chalk.red(`Erro ao gerar controller para ${entity}:`, error.message),
    );
  }
};

const generateEntityFile = (entityName, fields) => {
  const entityFolderPath = path.join(
    __dirname,
    `${entityName.toLowerCase()}`,
    'entities',
  );

  if (!fs.existsSync(entityFolderPath)) {
    fs.mkdirSync(entityFolderPath, { recursive: true });
  }

  const entityFilePath = path.join(
    __dirname,
    `${entityName.toLowerCase()}`,
    'entities',
    `${pluralize.singular(entityName.toLowerCase())}.entity.ts`,
  );

  const importStatements = [
    "import { Entity } from 'typeorm';\n",

    "import { CommonField } from '@decorators/fields/index.field.decorator';",
    "import { BaseEntity} from '@entities/base.entity';",
  ];

  const enumImports = fields
    .filter((field) => field.type === 'enum')
    .map(
      (field) =>
        `import { ${pluralize.singular(
          capitalizeFirstLetter(entityName),
        )}${capitalizeFirstLetter(
          field.name,
        )}Enum } from '../enum/${field.name.toLowerCase()}.enum';\n`,
    );

  const entityContent = `
${importStatements.join('\n')}
${enumImports.join('\n')}

  @Entity({
    name: '${entityName.toLowerCase()}',
  })
  export class ${pluralize.singular(
    capitalizeFirstLetter(entityName),
  )} extends BaseEntity {
${fields.map((field) => generateFieldContent(field)).join('\n\n')}
}
`;

  fs.writeFileSync(entityFilePath, entityContent);

  console.log(
    chalk.green(`Arquivo de entidade para ${entityName} gerado com sucesso.`),
  );
};

const generateFieldType = (field) => {
  if (field.type === 'enum') {
    return capitalizeFirstLetter(field.name) + 'Enum';
  }

  if (field.type === 'relation') {
    return field.relatedEntity;
  }

  if (
    field.type === 'varchar' ||
    field.type === 'text' ||
    field.type === 'url' ||
    field.type === 'string'
  ) {
    return 'string';
  }

  if (field.type === 'date') {
    return 'Date';
  }

  return 'number';
};

const generateFieldContent = (field) => {
  const length = field.maxSize
    ? {
        min: field.minSize,
        max: field.maxSize,
      }
    : null;

  const commonFieldParams = `{
  fieldName: '${field.name}',
    description: '${field.description || capitalizeFirstLetter(field.name)}',
      example: '${field.example}',
        type: '${String(field.type)?.toUpperCase()}',
          required: ${!field.optional},
  length: ${length ? JSON.stringify(length) : null},
  url: ${field.type === 'url'},
  enumType: ${
    field.type === 'enum'
      ? `${pluralize.singular(
          capitalizeFirstLetter(entityName),
        )}${capitalizeFirstLetter(field.name)}Enum`
      : null
  },
} `;

  return `
@CommonField(${commonFieldParams})
${field.name}${
    field.type === 'enum'
      ? `: ${pluralize.singular(
          capitalizeFirstLetter(entityName),
        )}${capitalizeFirstLetter(field.name)}Enum`
      : field.type === 'relation'
        ? `: ${field.relationEntity}`
        : `: ${generateFieldType(field)};`
  }`;
};

const generateService = (entity) => {
  try {
    const servicePath = path.join(
      __dirname,
      `${entity.toLowerCase()}`,
      `${entity.toLowerCase()}.service.ts`,
    );

    const serviceContent = `
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { handleErrors } from '@decorators/errors/error.handler.decorator'
import { QueryParamsDto } from '@pipes/get-queries-validator.pipe';
import { applyPaginationAndOrder, buildWhereClause } from '@commons/build-where';
import { ErrorMessages } from '@errors/index';

import { ${pluralize.singular(capitalizeFirstLetter(entity))} } from './entities/${pluralize.singular(capitalizeFirstLetter(entity)).toLocaleLowerCase()}.entity';
import { Create${pluralize.singular(capitalizeFirstLetter(entity))}Dto } from './dto/create-${pluralize.singular(entity.toLowerCase())}.dto';
import { Update${pluralize.singular(capitalizeFirstLetter(entity))}Dto } from './dto/update-${pluralize.singular(entity.toLowerCase())}.dto';

@Injectable()
export class ${capitalizeFirstLetter(entity)}Service {
  ${generateConstructor(entity)}

  ${generateCreateMethod(entity)}

  ${generateFindAllMethod(entity)}

  ${generateFindActivesMethod(entity)}

  ${generateFindOneMethod(entity)}

  ${generateUpdateMethod(entity)}

  ${generateRemoveMethod(entity)}
}
`;

    fs.writeFileSync(servicePath, serviceContent);

    console.log(chalk.green(`Serviço para ${entity} gerado com sucesso.`));
  } catch (error) {
    console.error(
      chalk.red(`Erro ao gerar serviço para ${entity}: `, error.message),
    );
  }
};

const generateConstructor = (entity) => {
  return `
constructor(
  @InjectRepository(${pluralize.singular(capitalizeFirstLetter(entity))})
  private repository: Repository <${pluralize.singular(capitalizeFirstLetter(entity))}>,
) { }
`;
};

const generateCreateMethod = (entity) => {
  return `
  async create(create${pluralize.singular(capitalizeFirstLetter(entity))}Dto: Create${pluralize.singular(capitalizeFirstLetter(entity))}Dto) {
  try {
    const data = await this.repository.save(create${pluralize.singular(capitalizeFirstLetter(entity))}Dto);

    return {
      message: '${entity} criado com sucesso!',
      data,
    };
  } catch (error) {
    handleErrors(error);
  }
}
`;
};

const generateFindAllMethod = (entity) => {
  return `
  async findAll({page = 1, limit = 10, filters, dateRange, search, exactMatch }: QueryParamsDto) {
  try {
    const whereClause = buildWhereClause({
      filters,
      dateRange,
      search,
      exactMatch,
    });

    const queryBuild = this.repository
      .createQueryBuilder('${entity.toLowerCase()}')
      .where(whereClause)
      .andWhere('${entity.toLowerCase()}.deleted_at IS NULL');

    const queryWithPagination = applyPaginationAndOrder(queryBuild, page, limit);

    const [results, total] = await queryWithPagination.getManyAndCount();

    return {
      message: 'Registros encontrados com sucesso!',
      data: results,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
      },
    };
  } catch (error) {
    handleErrors(error);
  }
}
`;
};

const generateFindActivesMethod = (entity) => {
  return `
  async findActives({page = 1, limit = 10, filters, dateRange, search, exactMatch }: QueryParamsDto) {
  try {
    const whereClause = buildWhereClause({
      filters,
      dateRange,
      search,
      exactMatch,
    });

    const queryBuild = this.repository
      .createQueryBuilder('${entity.toLowerCase()}')
      .where(whereClause);

    const queryWithPagination = applyPaginationAndOrder(queryBuild, page, limit);

    const [results, total] = await queryWithPagination.getManyAndCount();

    return {
      message: 'Registros encontrados com sucesso!',
      data: results,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
      },
    };
  } catch (error) {
    handleErrors(error);
  }
}
`;
};

const generateFindOneMethod = () => {
  return `
  async findOne(id: number) {
  try {
    const data = await this.repository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException(
        ErrorMessages.COMMON_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      message: 'Registro encontrado com sucesso!',
      data,
    }
  } catch (error) {
    handleErrors(error);
  }
}
`;
};

const generateUpdateMethod = (entity) => {
  return `
  async update(id: number, update${pluralize.singular(capitalizeFirstLetter(entity))}Dto: Update${pluralize.singular(capitalizeFirstLetter(entity))}Dto) {
  try {
    const data = await this.repository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException(
        ErrorMessages.COMMON_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedDate = await this.repository.save({
      ...data,
      ...update${pluralize.singular(capitalizeFirstLetter(entity))}Dto,
      });

  return {
    message: '${entity} atualizado com sucesso!',
    data: updatedDate,
  };
} catch (error) {
  handleErrors(error);
}
  }
`;
};

const generateRemoveMethod = (entity) => {
  return `
  async remove(id: number) {
  try {
    const data = await this.repository.findOne({
      where: { id },
    });

    if (!data) {
      throw new HttpException(
        ErrorMessages.COMMON_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const deleted = await this.repository.softDelete(id);

    if (!deleted) {
      throw new HttpException(
        ErrorMessages.COMMON_DELETE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: '${entity} removido com sucesso!',
      data: deleted,
    };
  } catch (error) {
    handleErrors(error);
  }
}
`;
};

const { entityName, fields } = getEntityInfo();

if (confirmDefinitions(entityName, fields)) {
  generateCRUD(entityName, fields);
}
