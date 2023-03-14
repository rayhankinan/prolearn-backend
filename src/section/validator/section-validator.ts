import { IsString, Matches } from 'class-validator';
import ValidatorComposer from '@validator/common.validator';

function IsSectionType(
  { required }: { required: boolean } = { required: false },
): PropertyDecorator {
  return ValidatorComposer([IsString(), Matches(/quiz|material|project/)])({
    required,
  });
}

export default IsSectionType;
