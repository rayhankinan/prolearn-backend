import { IsDefined, IsOptional } from 'class-validator';

function ValidatorComposer(
  validators: PropertyDecorator[],
): (options: { required: boolean }) => PropertyDecorator {
  return function ({ required }: { required: boolean } = { required: false }) {
    return function (target: any, propertyKey: string | symbol): void {
      if (!required) IsOptional()(target, propertyKey);
      else IsDefined()(target, propertyKey);
      validators.forEach((validator) => validator(target, propertyKey));
    };
  };
}

export default ValidatorComposer;
