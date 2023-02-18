import { IsString, Matches } from 'class-validator';
import ValidatorComposer from '@validator/common.validator';

function IsSectionType(
  { required }: { required: boolean } = { required: false },
): PropertyDecorator {
  return ValidatorComposer([IsString(), Matches(/QUIZ|MATERIAL|PROJECT/)])({
    required,
  });
}

export default IsSectionType;
