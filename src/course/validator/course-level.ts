import ValidatorComposer from '@validator/common.validator';
import { IsString, Matches } from 'class-validator';

function IsCourseLevel(
  { required }: { required: boolean } = { required: false },
): PropertyDecorator {
  return ValidatorComposer([
    IsString(),
    Matches(/BEGINNER|INTERMEDIATE|ADVANCED/),
  ])({ required });
}

export default IsCourseLevel;
