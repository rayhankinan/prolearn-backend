import ValidatorComposer from '@validator/common.validator';
import { IsString, Matches } from 'class-validator';

function IsCourseStatus(
  { required }: { required: boolean } = { required: false },
): PropertyDecorator {
  return ValidatorComposer([IsString(), Matches(/ACTIVE|INACTIVE/)])({
    required,
  });
}

export default IsCourseStatus;
